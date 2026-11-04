import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, EntityManager, Repository } from 'typeorm'
import { ProductError } from 'src/common/enums/errors.enum'
import { SerialStatus } from 'src/common/enums/serial-status.enum'
import { CreateSkuDto, SkuDetailDto, UpdateSkuDto } from '../dto/product-sku.dto'
import { ProductSkuEntity } from '../entities/product-sku.entity'
import { ProductEntity } from '../entities/product.entity'
import { SpuSkuMappingEntity } from '../entities/spu-sku-mapping.entity'
import { PriceService } from './price.service'

@Injectable()
export class ProductSkuService {
  constructor(
    @InjectRepository(ProductSkuEntity)
    private readonly skuRepository: Repository<ProductSkuEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly priceService: PriceService
  ) {}

  async findById(id: number): Promise<ProductSkuEntity> {
    const sku = await this.skuRepository.findOne({ where: { id }, relations: { spuSkuMapping: { spu: true } } })
    if (!sku) throw new NotFoundException(ProductError.SKU_NOT_FOUND)
    return sku
  }

  /**
   * Tồn kho = số serial AVAILABLE (không lưu cột số lượng).
   * Đọc thẳng bảng product_serials để module product không phụ thuộc module inventory.
   */
  async getAvailableStock(skuIds: number[], manager?: EntityManager): Promise<Map<number, number>> {
    if (skuIds.length === 0) return new Map()
    const rows: { product_sku_id: number; stock: number }[] = await (manager ?? this.dataSource).query(
      `SELECT product_sku_id, COUNT(*)::int AS stock
         FROM product_serials
        WHERE product_sku_id = ANY($1) AND status = $2
        GROUP BY product_sku_id`,
      [skuIds, SerialStatus.AVAILABLE]
    )
    return new Map(rows.map(row => [row.product_sku_id, row.stock]))
  }

  /** Giá hiện hành + tồn kho cho danh sách SKU (2 query, không N+1) */
  async toDetails(skus: ProductSkuEntity[], manager?: EntityManager): Promise<SkuDetailDto[]> {
    const ids = skus.map(sku => sku.id)
    const [prices, stock] = await Promise.all([
      this.priceService.getCurrentPrices(ids, manager),
      this.getAvailableStock(ids, manager)
    ])
    return skus.map(sku => ({
      id: sku.id,
      skuCode: sku.skuCode,
      name: sku.name,
      attributes: sku.attributes,
      imageUrl: sku.imageUrl,
      isActive: sku.isActive,
      price: prices.get(sku.id) ?? null,
      stock: stock.get(sku.id) ?? 0
    }))
  }

  /** Thêm SKU vào SPU (+ giá ban đầu nếu có) trong 1 transaction */
  async create(productId: number, data: CreateSkuDto, actorId: string | null, manager?: EntityManager): Promise<SkuDetailDto> {
    if (!manager) {
      const sku = await this.dataSource.transaction(m => this.insert(productId, data, actorId, m))
      return (await this.toDetails([sku]))[0]
    }
    const sku = await this.insert(productId, data, actorId, manager)
    return (await this.toDetails([sku], manager))[0]
  }

  async update(id: number, data: UpdateSkuDto): Promise<SkuDetailDto> {
    await this.findById(id)
    await this.skuRepository.update({ id }, data)
    return (await this.toDetails([await this.findById(id)]))[0]
  }

  private async insert(productId: number, data: CreateSkuDto, actorId: string | null, manager: EntityManager) {
    if (!(await manager.existsBy(ProductEntity, { id: productId }))) {
      throw new NotFoundException(ProductError.PRODUCT_NOT_FOUND)
    }
    const { sellingPrice, displayPrice, ...skuData } = data
    // Trùng sku_code → AllExceptionsFilter trả 409
    const sku = await manager.save(manager.create(ProductSkuEntity, skuData))
    await manager.save(manager.create(SpuSkuMappingEntity, { spuId: productId, skuId: sku.id }))
    if (sellingPrice !== undefined) {
      await this.priceService.create(sku.id, { sellingPrice, displayPrice }, actorId, manager)
    }
    return sku
  }
}
