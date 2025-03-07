import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  OneToOne
} from 'typeorm'
import { SupplierEntity } from '../../../supplier/supplier.entity'
import { EmployeeEntity } from 'src/modules/users/domain/entities/employee.entity'
import { PurchaseOrderDetailEntity } from './purchase-order-detail.entity'
import { WarehouseReceiptEntity } from './warehouse-receipt.entity'

@Entity({ name: 'purchase_orders' })
export class PurchaseOrderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'order_number', type: 'varchar', length: 50, unique: true })
  orderNumber: string

  @ManyToOne(() => SupplierEntity, supplier => supplier.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: SupplierEntity

  @ManyToOne(() => EmployeeEntity, employee => employee.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity

  @Column({ name: 'order_date', type: 'date', nullable: false })
  orderDate: Date

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @OneToMany(() => PurchaseOrderDetailEntity, purchaseOrderDetail => purchaseOrderDetail.purchaseOrder)
  purchaseOrderDetails!: PurchaseOrderDetailEntity[]

  @OneToOne(() => WarehouseReceiptEntity, { onDelete: 'SET NULL' })
  warehouseReceipt: WarehouseReceiptEntity
}
