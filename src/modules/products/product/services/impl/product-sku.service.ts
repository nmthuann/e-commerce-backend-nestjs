import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ProductSkuEntity } from '../../domain/entities/product-sku.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IProductSkuService } from '../product-sku.service.interface'
import { ProductSkuDto } from '../../domain/dtos/product-sku.dto'
import { mapAttributes } from 'src/utils/map'
import { IProductSerialService } from 'src/modules/inventories/inventory/services/product-serial.service.interface'
import { ProductSkuResponse } from '../../domain/dtos/responses/product-sku.response'
import { SpuSkuMappingEntity } from '../../domain/entities/spu-sku-mapping.entity'
import { PriceResponse } from '../../domain/dtos/responses/price.response'
import { PriceEntity } from '../../domain/entities/price.entity'

@Injectable()
export class ProductSkuService implements IProductSkuService {
  constructor(
    @InjectRepository(ProductSkuEntity)
    private readonly productSkuRepository: Repository<ProductSkuEntity>,
    @InjectRepository(SpuSkuMappingEntity)
    private readonly spuSkuMappingRepository: Repository<SpuSkuMappingEntity>,
    @InjectRepository(PriceEntity)
    private readonly priceRepository: Repository<PriceEntity>,
    @Inject('IProductSerialService')
    private readonly productSerialService: IProductSerialService
  ) {}

  async getOneById(id: number): Promise<ProductSkuDto> {
    const productSku = await this.productSkuRepository
      .createQueryBuilder()
      .select([
        'ps.id AS "id"',
        'ps.sku_no AS "skuNo"',
        'ps.barcode AS "barcode"',
        'ps.sku_name AS "skuName"',
        'ps.image AS "image"',
        'ps.status AS "status"',
        'ps.sku_attributes AS "skuAttributes"',
        'ps.slug AS "slug"',
        'p.selling_price AS "sellingPrice"',
        'p.display_price AS "displayPrice"'
      ])
      .from('product_skus', 'ps')
      .leftJoin(
        qb => {
          return qb
            .select(['p1.product_sku_id', 'p1.selling_price', 'p1.display_price'])
            .from('prices', 'p1')
            .where('p1.product_sku_id = :id', { id })
            .andWhere('p1.begin_at <= NOW()')
            .orderBy('p1.begin_at', 'DESC')
            .limit(1)
        },
        'p',
        'p.product_sku_id = ps.id'
      )
      .where('ps.id = :id', { id })
      .getRawOne()

    if (!productSku) {
      throw new NotFoundException(`Product SKU with id ${id} not found`)
    }

    return {
      ...productSku,
      skuAttributes: mapAttributes(productSku.skuAttributes),
      stock: (await this.productSerialService.getStock(productSku.id)) || 0
    }
  }

  async getAllByProductId(productId: number): Promise<ProductSkuResponse[]> {
    const spuSkus = await this.spuSkuMappingRepository.find({
      where: { spu: { id: productId } },
      relations: ['sku']
    })

    if (!spuSkus) {
      throw new NotFoundException(`Product with id ${productId} not found`)
    }

    const res: ProductSkuResponse[] = await Promise.all(
      spuSkus.map(async spuSku => ({
        id: spuSku.sku.id,
        skuNo: spuSku.sku.skuNo,
        barcode: spuSku.sku.barcode,
        skuName: spuSku.sku.skuName,
        image: spuSku.sku.image,
        status: spuSku.sku.status,
        slug: spuSku.sku.slug,
        skuAttributes: mapAttributes(spuSku.sku.skuAttributes),
        stock: await this.productSerialService.getStock(spuSku.sku.id)
      }))
    )
    return res
  }

  // TODO: add pagination
  async getPricesById(id: number): Promise<PriceResponse[]> {
    const prices = await this.priceRepository.find({ where: { productSkuId: id } })
    if (!prices) {
      throw new NotFoundException(`Product SKU with id ${id} not found`)
    }
    return prices.map(price => ({
      productSkuId: price.productSkuId,
      beginAt: price.beginAt,
      sellingPrice: price.sellingPrice,
      displayPrice: price.displayPrice,
      createdAt: price.createdAt
    }))
  }

  async getCurrentPriceById(id: number): Promise<PriceResponse> {
    const price = await this.priceRepository.findOne({
      where: { productSkuId: id },
      order: { beginAt: 'DESC' }
    })
    if (!price) {
      throw new NotFoundException(`Product SKU with id ${id} not found`)
    }
    return {
      productSkuId: price.productSkuId,
      beginAt: price.beginAt,
      sellingPrice: price.sellingPrice,
      displayPrice: price.displayPrice,
      createdAt: price.createdAt
    }
  }
}
