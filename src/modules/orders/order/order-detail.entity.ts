import { ProductEntity } from 'src/modules/v1/products/product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity({ name: 'OrderDetails' })
export class OrderDetailEntity {
  @PrimaryColumn()
  order_id: number;

  @PrimaryColumn()
  product_id: number;

  @Column({ nullable: false })
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.product_id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => OrderEntity, (order) => order.order_id)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
