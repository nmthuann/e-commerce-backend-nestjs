import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import { PurchaseOrderEntity } from './purchase-order.entity'
import { ProductSkuEntity } from 'src/modules/products/product/domain/entities/product-sku.entity'

@Entity({ name: 'purchase_order_details' })
export class PurchaseOrderDetailEntity {
  @PrimaryColumn({ name: 'purchase_order_id' })
  purchaseOrderId: number

  @PrimaryColumn({ name: 'sku_id' })
  skuId: number

  @Column({ type: 'integer', nullable: false })
  quantity: number

  @Column({ name: 'unit_price', type: 'double precision', nullable: false })
  unitPrice: number

  @ManyToOne(() => PurchaseOrderEntity, purchaseOrder => purchaseOrder.purchaseOrderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrderEntity

  @ManyToOne(() => ProductSkuEntity, sku => sku.purchaseOrderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sku_id' })
  sku: ProductSkuEntity
}
