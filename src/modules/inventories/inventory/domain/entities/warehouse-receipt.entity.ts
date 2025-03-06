import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  OneToMany
} from 'typeorm'
import { PurchaseOrderEntity } from './purchase-order.entity'
import { EmployeeEntity } from 'src/modules/users/domain/entities/employee.entity'
import { ProductSerialEntity } from './product-serial.entity'

@Entity({ name: 'warehouse_receipts' })
export class WarehouseReceiptEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'receipt_number', type: 'varchar', length: 50, unique: true })
  receiptNumber: string

  @OneToOne(() => PurchaseOrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrderEntity

  @CreateDateColumn({ name: 'receipt_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  receiptDate: Date

  @ManyToOne(() => EmployeeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity

  @OneToMany(() => ProductSerialEntity, productSerial => productSerial.warehouseReceipt)
  productSerials: ProductSerialEntity[]
}
