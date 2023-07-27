import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderEntity } from "../order/order.entity";

@Entity({ name: 'Shippings' })
export class ShippingEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    shipping_id: number;

    @Column({ nullable: false })
    shipping_name: string;

    @Column({ nullable: false })
    ship_cost: number;

    // Other properties of Shipping
}
