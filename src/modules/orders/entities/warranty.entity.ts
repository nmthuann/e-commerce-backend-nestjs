import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { InvoiceEntity } from './invoice.entity'
import { ProductSerialEntity } from 'src/modules/inventories/inventory/domain/entities/product-serial.entity'

@Entity({ name: 'warranties' })
export class WarrantyEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => ProductSerialEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_serial_id' })
  productSerial: ProductSerialEntity

  @ManyToOne(() => InvoiceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date
}
