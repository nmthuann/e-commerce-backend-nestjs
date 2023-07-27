import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderEntity } from "../order/order.entity";

@Entity({ name: 'Payments' })
export class PaymentEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({ nullable: false })
    payment_name: string;

    @Column()
    description: string;
}
