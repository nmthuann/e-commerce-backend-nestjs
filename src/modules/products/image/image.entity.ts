import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { BaseEntity } from 'src/modules/bases/base.entity';

@Entity({ name: 'Images' }) 
export class ImageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  image_id: string;

  @ManyToOne(() => ProductEntity, (product) => product.images, {
    onUpdate: 'CASCADE',
  })
  product: ProductEntity;

  @Column({ nullable: false })
  url: string;
}
