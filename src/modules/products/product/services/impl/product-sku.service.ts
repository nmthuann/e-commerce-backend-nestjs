import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ProductSkuEntity } from '../../domain/entities/product-sku.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { IProductSkuService } from '../product-sku.service.interface'
import { ProductSkuDto } from '../../domain/dtos/product-sku.dto'
import { IInventoryService } from 'src/modules/inventories/inventory/services/inventory.service.interface'
import { mapAttributes } from 'src/utils/map'

@Injectable()
export class ProductSkuService implements IProductSkuService {
  constructor(
    @InjectRepository(ProductSkuEntity)
    private readonly productSkuRepository: Repository<ProductSkuEntity>,
    @Inject('IInventoryService')
    private readonly inventoryService: IInventoryService
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
      stock: (await this.inventoryService.getStock(productSku.id)) || 0
    }
  }
}
