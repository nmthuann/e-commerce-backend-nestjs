import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm'
import { ProductSkuEntity } from '../product/domain/entities/product-sku.entity'

@Entity({ name: 'prices' })
export class PriceEntity {
  @PrimaryColumn({ name: 'product_sku_id', type: 'int' })
  productSkuId: number

  @PrimaryColumn({ name: 'begin_at', type: 'timestamp' })
  beginAt: Date

  @Column({ name: 'selling_price', type: 'double precision' })
  sellingPrice: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @ManyToOne(() => ProductSkuEntity, productSku => productSku.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_sku_id' })
  productSku: ProductSkuEntity
}
