import { ProductEntity } from "src/modules/products/product/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

@Entity({name: 'OrderDetails'})
export class OrderDetailEntity{
    @PrimaryColumn()
    order_id: number

    @PrimaryColumn()
    product_id: number

    @Column()
    quantity: number

    
    @ManyToOne(() => ProductEntity, product => product.product_id)
    @JoinColumn({ name: "product_id" })
    product: ProductEntity;


    @ManyToOne(() => OrderEntity, order => order.order_id)
    @JoinColumn({ name: "order_id" })
    order: OrderEntity;
}