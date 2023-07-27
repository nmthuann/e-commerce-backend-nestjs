import { ProductEntity } from "src/modules/products/product/entities/product.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "./cart.entity";

@Entity({name: 'CartDetails'})
export class CartDetailEntity{

    // @PrimaryGeneratedColumn()
    // cart_detail_id: number

    @PrimaryColumn()
    cart_id: number

    @PrimaryColumn()
    product_id: number

    @Column()
    quantity: number


    @ManyToOne(() => ProductEntity, product => product.product_id)
    @JoinColumn({ name: "product_id" })
    product: ProductEntity;


    @ManyToOne(() => CartEntity, cart => cart.cart_id)
    @JoinColumn({ name: "cart_id" })
    cart: CartEntity;

    // @OneToMany(() => ProductEntity, product => product.cart_detail, { cascade: true })
    // // @JoinColumn({name: 'product_id'})
    // products: ProductEntity[];

    // @OneToMany(() => CartEntity, cart => cart.cart_detail, { cascade: true })
    // //@JoinColumn({name: 'cart_id'})
    // carts: CartEntity[];
}