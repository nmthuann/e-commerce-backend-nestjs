import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CartEntity } from "../cart/cart.entity";
import { CartDetailEntity } from "../cart/cart-detail.entity";
import { ShippingEntity } from "../shipping/shipping.entity";
import { PaymentEntity } from "../payment/payment.entity";
import { EmployeeEntity } from "src/modules/users/employee/employee.entity";
import { UserEntity } from "src/modules/users/user/user.entity";
import { DiscountEntity } from "src/modules/products/discount/discount.entity";
import { BaseEntity } from "src/modules/bases/base.entity";

@Entity({name: 'Orders'})
export class OrderEntity extends BaseEntity{

    @PrimaryGeneratedColumn()
    order_id: number

    @Column({default: 0})
    total_price:number

    @Column({ nullable: false })
    status: string

    @Column()
    delivery_address: string

    // @OneToOne(() => ShippingEntity)
    // @JoinColumn({name: 'shipping_id'})
    // shipping: ShippingEntity

    // @OneToOne(() => PaymentEntity)
    // @JoinColumn({name: 'payment_id'})
    // payment: PaymentEntity

    // @OneToOne(() => EmployeeEntity, (employee) => employee.order)
    // @JoinColumn({name: 'employee_id'})
    // employee: EmployeeEntity

    // @OneToOne(() => UserEntity, (user) => user.order)
    // @JoinColumn({name: 'user_id'})
    // user: UserEntity

    // @OneToOne(() => DiscountEntity)
    // @JoinColumn({name: 'discount_id'})
    // discount: DiscountEntity


    @ManyToOne(() => DiscountEntity, (discount) => discount.orders, { lazy: true })
    @JoinColumn({ name: 'discount_id' })
    discount: DiscountEntity
    
    @ManyToOne(() => UserEntity, (user) => user.orders, { lazy: true })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity

    @ManyToOne(() => EmployeeEntity, (employee) => employee.orders, { lazy: true })
    @JoinColumn({ name: 'employee_id' })
    employee: EmployeeEntity

    @ManyToOne(() => ShippingEntity, (shipping) => shipping.orders, { lazy: true })
    @JoinColumn({ name: 'shipping_id' })
    shipping: ShippingEntity

    @ManyToOne(() => PaymentEntity, (payment) => payment.orders, { lazy: true })
    @JoinColumn({ name: 'payment_id' })
    payment: PaymentEntity
}