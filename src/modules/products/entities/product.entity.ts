import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'
import { BrandEntity } from './brand.entity'
import { CategoryEntity } from './category.entity'
import { SpuSkuMappingEntity } from './spu-sku-mapping.entity'

// SPU — dòng sản phẩm (vd "iPhone 15"); biến thể bán được nằm ở ProductSkuEntity
@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string

  @ManyToOne(() => BrandEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandEntity

  @ManyToOne(() => CategoryEntity, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity

  @Column({ type: 'text', nullable: true })
  description?: string

  /** Thông số chung của dòng máy, vd { "Màn hình": "6.1 inch", "Chip": "A16 Bionic" } */
  @Column({ type: 'jsonb', nullable: true })
  specs?: Record<string, string>

  @Column({ name: 'warranty_months', type: 'smallint', default: 12 })
  warrantyMonths: number

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean

  /** Số nhỏ hiển thị trước */
  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number

  @OneToMany(() => SpuSkuMappingEntity, mapping => mapping.spu)
  spuSkuMappings?: SpuSkuMappingEntity[]
}
