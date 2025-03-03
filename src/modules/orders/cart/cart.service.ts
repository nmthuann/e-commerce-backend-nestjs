import { InjectRepository } from '@nestjs/typeorm'
import { CartItemEntity } from './cart-item.entity'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ICartService } from './cart.service.interface'
import { Repository } from 'typeorm'
import { CartDto, CartItemDto } from './dtos/cart.dto'
import { CreateCartDto } from './dtos/create-cart.dto'
import { IProductSkuService } from 'src/modules/products/product/services/product-sku.service.interface'

@Injectable()
export class CartService implements ICartService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartRepository: Repository<CartItemEntity>,
    @Inject('IProductSkuService')
    private readonly productSkuService: IProductSkuService
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
    const cartItems = await this.cartRepository
      .createQueryBuilder('cartItem')
      .leftJoinAndSelect('cartItem.productSku', 'productSku')
      .where('cartItem.userId = :userId', { userId })
      .select([
        'cartItem.productSkuId AS "productSkuId"',
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

  deleteOne(userId: string, productSkuId: number): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
