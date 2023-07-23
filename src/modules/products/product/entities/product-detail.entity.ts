import { BaseEntity } from "src/modules/bases/base.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm"
import { ProductEntity } from "./product.entity"

@Entity({name: 'ProductDetails'})
export class ProductDetailEntity {
    @PrimaryGeneratedColumn()
    product_detail_id: number

    @Column()
    description: string;

    @Column({nullable: false})
    brand: string;  //  thương hiệu

    @Column({nullable: false})
    origin: string;  //  xuất xứ

    @Column()
    warranty: number  // thới gian bảo hành

    @OneToOne(() => ProductEntity, (product) => product.product_detail)
    product: ProductEntity;
}