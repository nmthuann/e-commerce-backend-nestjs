// discount.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';

@Entity({ name: 'Discounts' }) // Set the table name explicitly (optional)
export class DiscountEntity {
    @PrimaryGeneratedColumn()
    discount_id: number;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 5, scale: 2 }) // Precision of 5 and scale of 2 for 2 decimal places
    percent: number;

    @OneToMany(() => ProductEntity, (product) => product.discount)
    products: ProductEntity[]
}
