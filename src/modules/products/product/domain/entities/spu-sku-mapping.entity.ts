import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    JoinColumn, 
 
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductSkuEntity } from './product-sku.entity';

@Entity({ name: 'spu_sku_mapping' })
export class SpuSkuMappingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductEntity, product => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spu_id' })
  spu!: ProductEntity;

  @ManyToOne(() => ProductSkuEntity, sku => sku.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sku_id' })
  sku!: ProductSkuEntity;
}
