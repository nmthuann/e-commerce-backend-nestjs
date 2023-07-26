import { ProductEntity } from "src/modules/products/product/entities/product.entity";
import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "./cart.entity";

@Entity({name: 'CartDetails'})
export class CartDetailEntity{

    @PrimaryGeneratedColumn()
    cart_detail_id: number

    // @PrimaryColumn()
    // cart_id: number

    // @PrimaryColumn()
    // product_id: number

    @Column()
    quantity: number

    @OneToMany(() => ProductEntity, product => product.cart_detail, { cascade: true })
    @JoinColumn({name: 'product_id'})
    products: ProductEntity[];

    @OneToMany(() => CartEntity, cart => cart.cart_detail, { cascade: true })
    @JoinColumn({name: 'cart_id'})
    carts: CartEntity[];
}