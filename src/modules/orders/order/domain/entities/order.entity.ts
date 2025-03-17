import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm'
import { EmployeeEntity } from 'src/modules/users/domain/entities/employee.entity'
import { OrderStatus } from 'src/constants/order-status.enum'
import { UserEntity } from 'src/modules/users/domain/entities/user.entity'
import { OrderDetailEntity } from './order-detail.entity'

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => EmployeeEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus

  @Column({ name: 'order_type', type: 'boolean', default: true })
  orderType: boolean

  @Column({ name: 'shipping_address', type: 'text' })
  shippingAddress: string

  @Column({ name: 'contact_phone', type: 'varchar', length: 15 })
  contactPhone: string

  @Column({ name: 'shipping_method', type: 'varchar', length: 50 })
  shippingMethod: string

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod: string

  @Column({ type: 'text', nullable: true })
  note?: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date

  @Column({ name: 'shipping_fee', type: 'numeric', precision: 10, scale: 2, default: 0.0 })
  shippingFee: number

  @Column({ name: 'discount', type: 'numeric', default: 0 })
  discount: number

  @Column({ type: 'varchar', nullable: true })
  postcode?: string

  @OneToMany(() => OrderDetailEntity, orderDetails => orderDetails.order)
  orderDetails: OrderDetailEntity[]
}
