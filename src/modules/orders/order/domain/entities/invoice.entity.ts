import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from 'typeorm'
import { OrderEntity } from './order.entity'
import { EmployeeEntity } from 'src/modules/users/domain/entities/employee.entity'

@Entity({ name: 'invoices' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ name: 'invoice_code', type: 'varchar', length: 50, unique: true })
  invoiceCode: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ name: 'tax_code', type: 'varchar', length: 20 })
  taxCode: string

  @OneToOne(() => OrderEntity, order => order.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity

  @ManyToOne(() => EmployeeEntity, employee => employee.invoices, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity
}
