import { Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm'
import { ProductEntity } from './product.entity'
import { ProductSkuEntity } from './product-sku.entity'

// Liên kết SPU (products) ↔ SKU (product_skus). PK (spu_id, sku_id); sku_id unique → mỗi SKU thuộc đúng 1 SPU
// (unique khai báo tường minh vì TypeORM không tự tạo unique cho OneToOne khi cột nằm trong PK)
@Entity({ name: 'spu_sku_mapping' })
@Index('UQ_spu_sku_mapping_sku_id', ['skuId'], { unique: true })
export class SpuSkuMappingEntity {
  @PrimaryColumn({ name: 'spu_id', type: 'integer' })
  spuId: number

  @PrimaryColumn({ name: 'sku_id', type: 'integer' })
  skuId: number

  @ManyToOne(() => ProductEntity, product => product.spuSkuMappings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spu_id' })
  spu: ProductEntity

  @OneToOne(() => ProductSkuEntity, sku => sku.spuSkuMapping, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sku_id' })
  sku: ProductSkuEntity
}
