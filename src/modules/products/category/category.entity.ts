import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';


@Entity({ name: 'categories' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_name', type: 'varchar', length: 50, nullable: false })
  categoryName!: string;

  @Column({ name: 'category_url', type: 'varchar', length: 255, nullable: false, unique: true })
  categoryUrl!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
