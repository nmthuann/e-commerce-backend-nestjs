import { UserEntity } from "src/modules/users/user/user.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartDetailEntity } from "./cart-detail.entity";

@Entity({name: 'Carts'})
export class CartEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    cart_id: number

    @OneToOne(() => UserEntity) // specify inverse side as a second parameter
    @JoinColumn({name: 'user_id'})
    user: UserEntity

    @Column()
    status: number

    // @ManyToOne(() => CartDetailEntity, (cart_detail) => cart_detail.carts)
    // cart_detail: CartDetailEntity
}

