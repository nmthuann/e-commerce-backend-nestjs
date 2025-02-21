import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { BrandEntity } from './brand.entity';

@Entity({ name: 'products' })

export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name', type: 'varchar', length: 255, nullable: false, unique: true })
  productName!: string;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true})
  slug!: string;

  @Column({ name: 'product_line', type: 'varchar', length: 100, nullable: false })
  productLine!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'boolean', nullable: false })
  status!: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted!: boolean;

  @Column({ name: 'priority_sort', type: 'integer', default: 0 })
  prioritySort!: number;

  @Column({ name: 'product_specs', type: 'jsonb', nullable: true })
  productSpecs?: Record<string, unknown>;

  @ManyToOne(() => CategoryEntity, category => category.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: CategoryEntity;

  @ManyToOne(() => BrandEntity, brand => brand.id, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand?: BrandEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
