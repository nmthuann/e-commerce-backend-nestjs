import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'product_skus' })
export class ProductSkuEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ 
    name: 'sku_no', 
    type: 'varchar', 
    length: 32, 
    nullable: false, 
    unique: true 
  })
  skuNo!: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  barcode!: string;

  @Column({ name: 'sku_name', type: 'varchar', length: 150, nullable: false })
  skuName!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  image!: string;

  @Column({ type: 'boolean', default: true })
  status!: boolean;

  @Column({ name: 'sku_attributes', type: 'jsonb', nullable: true })
  skuAttributes?: Record<string, unknown>;

  @Column({ type: 'varchar', length: 100, nullable: false, unique: true})
  slug!: string;
}
