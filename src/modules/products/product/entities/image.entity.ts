// image.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './product.entity';
import { BaseEntity } from 'src/modules/bases/base.entity';


@Entity({ name: 'Images' }) // Set the table name explicitly (optional)
export class ImageEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    image_id: string;

    @ManyToOne(() => ProductEntity, product => product.images, { onUpdate: 'CASCADE' })
    product: ProductEntity;

    @Column({nullable: false})
    url: string;
}
