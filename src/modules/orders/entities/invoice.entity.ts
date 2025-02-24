import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { EmployeeEntity } from 'src/modules/users/entities/employee.entity';

@Entity({ name: 'invoices' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_code', type: 'varchar', length: 50, unique: true })
  invoiceCode: string;

  @ManyToOne(() => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => EmployeeEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'tax_code', type: 'varchar', length: 20 })
  taxCode: string;
}
