import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'
import { PriceEntity } from './price.entity'
import { SpuSkuMappingEntity } from './spu-sku-mapping.entity'

// SKU — biến thể bán được (vd "iPhone 15 256GB Xanh"); mỗi máy thực tế là 1 product_serial của SKU này
@Entity({ name: 'product_skus' })
export class ProductSkuEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  /** Mã SKU nội bộ, dùng trên đơn đặt hàng / phiếu nhập; không đổi sau khi tạo */
  @Column({ name: 'sku_code', type: 'varchar', length: 50, unique: true })
  skuCode: string

  @Column({ type: 'varchar', length: 255 })
  name: string

  /** Thuộc tính phân biệt biến thể, vd { "Màu": "Xanh", "Dung lượng": "256GB" } */
  @Column({ type: 'jsonb', nullable: true })
  attributes?: Record<string, string>

  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  imageUrl?: string

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  @OneToOne(() => SpuSkuMappingEntity, mapping => mapping.sku)
  spuSkuMapping?: SpuSkuMappingEntity

  @OneToMany(() => PriceEntity, price => price.productSku)
  prices?: PriceEntity[]
}
