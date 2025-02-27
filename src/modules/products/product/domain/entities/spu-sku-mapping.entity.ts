import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne, Column } from 'typeorm'
import { ProductEntity } from './product.entity'
import { ProductSkuEntity } from './product-sku.entity'

@Entity({ name: 'spu_sku_mapping' })
export class SpuSkuMappingEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'boolean', nullable: false })
  status!: boolean

  @ManyToOne(() => ProductEntity, product => product.spuSkuMappings, { onDelete: 'CASCADE' }) //, product => product.id,
  @JoinColumn({ name: 'spu_id' })
  spu!: ProductEntity

  @OneToOne(() => ProductSkuEntity, productSku => productSku.spuSkuMapping, { onDelete: 'CASCADE' }) //, sku => sku.id,
  @JoinColumn({ name: 'sku_id' })
  sku!: ProductSkuEntity
}
