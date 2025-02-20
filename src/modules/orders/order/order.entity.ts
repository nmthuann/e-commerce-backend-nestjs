import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ShippingEntity } from '../shipping/shipping.entity';
import { PaymentEntity } from '../payment/payment.entity';
import { EmployeeEntity } from 'src/modules/users/employee/employee.entity';
import { UserEntity } from 'src/modules/users/user/user.entity';
import { DiscountEntity } from 'src/modules/products/discount/discount.entity';
import { BaseEntity } from 'src/common/bases/base.entity';

@Entity({ name: 'Orders' })
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  order_id: number;

  @Column({ default: 0 })
  total_price: number;

  @Column({ nullable: false })
  status: string;

  @Column()
  delivery_address: string;

  @Column({ type: 'nvarchar', length: 15 })
  contact: string;

  @ManyToOne(() => DiscountEntity, (discount) => discount.orders, {
    lazy: true,
  })
  @JoinColumn({ name: 'discount_id' })
  discount: DiscountEntity;

  @ManyToOne(() => UserEntity, (user) => user.orders, { lazy: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.orders, {
    lazy: true,
  })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @ManyToOne(() => ShippingEntity, (shipping) => shipping.orders, {
    lazy: true,
  })
  @JoinColumn({ name: 'shipping_id' })
  shipping: ShippingEntity;

  @ManyToOne(() => PaymentEntity, (payment) => payment.orders, { lazy: true })
  @JoinColumn({ name: 'payment_id' })
  payment: PaymentEntity;
}
