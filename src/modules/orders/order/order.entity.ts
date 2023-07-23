import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'Orders'})
export class OrderEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    order_id: number
}