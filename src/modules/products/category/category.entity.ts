import { BaseEntity } from 'src/common/bases/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';

@Entity({ name: 'Categories' })
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ length: 50, nullable: false })
  category_name: string;

  @Column()
  description: string;

  @Column()
  category_url: string;

  @OneToMany(
    () => ProductEntity,
    (product) => product.category,

  )
  products: ProductEntity[];
}
