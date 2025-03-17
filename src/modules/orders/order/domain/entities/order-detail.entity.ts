import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, OneToOne } from 'typeorm'
import { OrderEntity } from './order.entity'
import { ProductSerialEntity } from 'src/modules/inventories/inventory/domain/entities/product-serial.entity'

@Entity({ name: 'order_details' })
export class OrderDetailEntity {
  @PrimaryColumn({ name: 'order_id', type: 'int' })
  orderId: number

  @PrimaryColumn({ name: 'product_serial_id', type: 'uuid' })
  productSerialId: string

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2, default: 0.0 })
  unitPrice: number

  @Column({ name: 'tax', type: 'numeric', precision: 5, scale: 2, default: 0.0 })
  tax: number // Phần trăm thuế (%)

  @ManyToOne(() => OrderEntity, order => order.orderDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity

  @OneToOne(() => ProductSerialEntity, productSerial => productSerial.orderDetail, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_serial_id' })
  productSerial: ProductSerialEntity
}
