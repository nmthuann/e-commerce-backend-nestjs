import {  Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderEntity } from "../order/order.entity";

@Entity({ name: 'Payments' })
export class PaymentEntity{
    @PrimaryGeneratedColumn()
    payment_id: number;

    @Column({type: "nvarchar", length: 100, nullable: false })
    payment_name: string;

    @Column()
    description: string;
}
