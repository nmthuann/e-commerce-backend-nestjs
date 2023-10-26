import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderEntity } from '../order/order.entity';

@Entity({ name: 'Shippings' })
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  shipping_id: number;

  @Column({ type: 'nvarchar', length: 100, nullable: false })
  shipping_name: string;

  @Column({ default: 0, nullable: false })
  ship_cost: number;

  @Column({ nullable: false })
  estimated_time: number; // thời gian dự kiến

  @OneToMany(() => OrderEntity, (order) => order.shipping)
  orders: OrderEntity[];
}
