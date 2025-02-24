import { ProductEntity } from 'src/modules/products/product/backup/product.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity({ name: 'CartDetails' })
export class CartDetailEntity {
  @PrimaryColumn()
  cart_id: number;
  @PrimaryColumn()
  product_id: number;

  @Column({ default: 1, nullable: false })
  quantity: number;

  @ManyToOne(() => ProductEntity, (product) => product.product_id)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.cart_id)
  @JoinColumn({ name: 'cart_id' })
  cart: CartEntity;

}
