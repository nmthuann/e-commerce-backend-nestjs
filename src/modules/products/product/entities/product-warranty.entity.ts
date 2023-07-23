// product-warranties.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { BaseEntity } from 'src/modules/bases/base.entity';
import { EmployeeEntity } from 'src/modules/users/employee/employee.entity';
import { OrderEntity } from 'src/modules/orders/order/order.entity';

@Entity({name: 'Warranties'})
export class ProductWarrantyEnity extends BaseEntity {
  @PrimaryGeneratedColumn()
  warranty_id: number;

  @Column()
  note: string

  @OneToOne(() => ProductEntity)
  @JoinColumn({name: 'product_id'})
  product: ProductEntity;

  @OneToOne(() => EmployeeEntity)
  @JoinColumn({name: 'employee_id'})
  employee: EmployeeEntity


  @OneToOne(() => OrderEntity)
  @JoinColumn({name: 'order_id'})
  order: OrderEntity
}
