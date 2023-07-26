import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "../cart/cart.entity";
import { CartDetailEntity } from "../cart/cart-detail.entity";
import { ShippingEntity } from "./shipping.entity";
import { PaymentEntity } from "./payment.entity";
import { EmployeeEntity } from "src/modules/users/employee/employee.entity";
import { UserEntity } from "src/modules/users/user/user.entity";
import { DiscountEntity } from "src/modules/products/discount/discount.entity";

@Entity({name: 'Orders'})
export class OrderEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    order_id: number

    @OneToOne(() => CartDetailEntity)
    @JoinColumn({name: 'cart_detail_id'})
    cart_detail: CartDetailEntity

    @OneToOne(() => ShippingEntity)
    @JoinColumn({name: 'shipping_id'})
    shipping: ShippingEntity

    @OneToOne(() => PaymentEntity)
    @JoinColumn({name: 'payment_id'})
    payment: PaymentEntity

    @OneToOne(() => EmployeeEntity, (employee) => employee.order)
    @JoinColumn({name: 'employee_id'})
    employee: EmployeeEntity

    @OneToOne(() => UserEntity, (user) => user.order)
    @JoinColumn({name: 'user_id'})
    user: UserEntity


    @OneToOne(() => DiscountEntity)
    @JoinColumn({name: 'discount_id'})
    discount: DiscountEntity


    @Column()
    total_price:number

    @Column({ nullable: false })
    status: string

}