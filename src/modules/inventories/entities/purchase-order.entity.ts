import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { SupplierEntity } from './supplier.entity';
import { EmployeeEntity } from 'src/modules/users/entities/employee.entity';

@Entity({ name: 'purchase_orders' })
export class PurchaseOrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'order_number', type: 'varchar', length: 50, unique: true })
  orderNumber: string;

  @ManyToOne(() => SupplierEntity, (supplier) => supplier.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: SupplierEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @CreateDateColumn({name:'order_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;
}
