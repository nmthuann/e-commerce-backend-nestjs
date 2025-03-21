import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from 'typeorm'
import { SpuSkuMappingEntity } from './spu-sku-mapping.entity'
import { PriceEntity } from 'src/modules/products/product/domain/entities/price.entity'
import { PurchaseOrderDetailEntity } from 'src/modules/inventories/inventory/domain/entities/purchase-order-detail.entity'

@Entity({ name: 'product_skus' })
export class ProductSkuEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    name: 'sku_no',
    type: 'varchar',
    length: 32,
    nullable: false,
    unique: true
  })
  skuNo!: string

  @Column({ type: 'varchar', length: 32, nullable: false })
  barcode!: string

  @Column({ name: 'sku_name', type: 'varchar', length: 150, nullable: false })
  skuName!: string

  @Column({ type: 'varchar', length: 255, nullable: false })
  image!: string

  @Column({ type: 'boolean', default: true })
  status!: boolean

  @Column({ name: 'sku_attributes', type: 'jsonb', nullable: true })
  skuAttributes?: Record<string, unknown>

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
  slug!: string

  @OneToOne(() => SpuSkuMappingEntity, spuSkuMapping => spuSkuMapping.sku)
  spuSkuMapping: SpuSkuMappingEntity

  @OneToMany(() => PriceEntity, price => price.productSku)
  prices!: PriceEntity[]

  @OneToMany(() => PurchaseOrderDetailEntity, purchaseOrderDetail => purchaseOrderDetail.sku)
  purchaseOrderDetails!: PurchaseOrderDetailEntity[]
}
