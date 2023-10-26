// discount.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { BaseEntity } from 'src/modules/bases/base.entity';
import { OrderEntity } from 'src/modules/orders/order/order.entity';

@Entity({ name: 'Discounts' }) // Set the table name explicitly (optional)
export class DiscountEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  discount_id: number;

  @Column()
  description: string;

  @Column({ nullable: false })
  expired: Date;

  @Column({ type: 'int' }) // Precision of 5 and scale of 2 for 2 decimal places
  percent: number;

  @OneToMany(() => ProductEntity, (product) => product.discount)
  products: ProductEntity[];

  @OneToMany(() => OrderEntity, (order) => order.discount)
  orders: OrderEntity[];
}
