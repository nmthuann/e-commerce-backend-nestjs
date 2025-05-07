import { InjectRepository } from '@nestjs/typeorm'
import { CartItemEntity } from './cart-item.entity'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ICartService } from './cart.service.interface'
import { DataSource, Repository } from 'typeorm'
import { CartDto, CartItemDto } from './dtos/cart.dto'
import { CreateCartDto } from './dtos/create-cart.dto'
import { IProductSkuService } from 'src/modules/products/product/services/product-sku.service.interface'
import { mapAttributes } from 'src/utils/map'
import { CartSelectType } from './cart-select.type'

@Injectable()
export class CartService implements ICartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartRepository: Repository<CartItemEntity>,
    @Inject('IProductSkuService')
    private readonly productSkuService: IProductSkuService,
    private readonly dataSource: DataSource
  ) {}

  async createOne(userId: string, data: CreateCartDto): Promise<CartDto> {
    const getProductSku = await this.productSkuService.getOneById(data.productSkuId)

    if (!getProductSku) {
      throw new NotFoundException('Product SKU not found')
    }

    if (data.quantity > getProductSku.stock) {
      throw new BadRequestException('Quantity exceeds available stock')
    }

    await this.cartRepository.manager.transaction(async transactionalEntityManager => {
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(CartItemEntity)
        .values({
          userId,
          productSkuId: getProductSku.id,
          quantity: data.quantity,
          priceAtAdded: getProductSku.sellingPrice
        })
        .orUpdate(['quantity'], ['user_id', 'product_sku_id']) // Chỉ cập nhật số lượng, không thay đổi giá
        .execute()
    })

    const cart = await this.getCart(userId)
    return cart
  }

  async getCart(userId: string): Promise<CartDto> {
    const cartItems: CartSelectType[] = await this.cartRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.productSku', 'productSku')
      .where('cartItem.userId = :userId', { userId })
      .select([
        'cartItem.productSkuId AS "productSkuId"',
        'productSku.skuAttributes AS "skuAttributes"',
        'cartItem.quantity AS "quantity"',
        'cartItem.priceAtAdded AS "priceAtAdded"',
        'productSku.skuName AS "skuName"',
        'productSku.image AS "image"'
      ])
      .getRawMany()

    if (!cartItems.length) {
      return {
        userId,
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    }

    const items: CartItemDto[] = cartItems.map(item => ({
      productSkuId: item.productSkuId,
      skuName: item.skuName,
      image: item.image,
      skuAttributes: mapAttributes(item.skuAttributes),
      quantity: item.quantity,
      priceAtAdded: item.priceAtAdded,
      totalItemPrice: item.quantity * item.priceAtAdded
    }))

    return {
      userId,
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: items.reduce((sum, item) => sum + item.totalItemPrice, 0)
    }
  }

  async deleteOne(userId: string, productSkuId: number): Promise<void> {
    try {
      const result = await this.cartRepository.delete({ userId, productSkuId })

      if (result.affected === 0) {
        throw new Error('Không tìm thấy sản phẩm trong giỏ hàng')
      }
    } catch (error) {
      console.error(`Lỗi khi xóa sản phẩm SKU ${productSkuId} khỏi giỏ hàng của user ${userId}:`, error)
      throw new Error('Không thể xóa sản phẩm, vui lòng thử lại')
    }
  }

  async deleteAllByUserId(userId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const carts = await queryRunner.manager.find(CartItemEntity, {
        where: { user: { id: userId } }
      })

      if (carts.length > 0) {
        await queryRunner.manager.remove(CartItemEntity, carts)
      }

      await queryRunner.commitTransaction()
    } catch (error) {
      await queryRunner.rollbackTransaction()
      console.error('Lỗi khi xóa giỏ hàng:', error)
      throw new Error('Không thể xóa giỏ hàng, vui lòng thử lại.')
    } finally {
      await queryRunner.release()
    }
  }
}
