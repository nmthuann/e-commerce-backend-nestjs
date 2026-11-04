import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { decimalTransformer } from 'src/common/utils/decimal.transformer';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ProductSkuEntity } from './product-sku.entity';

// Lịch sử giá bán: CHỈ INSERT, không UPDATE/DELETE.
// Giá hiện hành của 1 SKU = bản ghi có begin_at <= now() mới nhất.
@Entity({ name: 'prices' })
export class PriceEntity {
  @PrimaryColumn({ name: 'product_sku_id', type: 'integer' })
  productSkuId: number;

  @PrimaryColumn({ name: 'begin_at', type: 'timestamptz' })
  beginAt: Date;

  @Column({
    name: 'selling_price',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  sellingPrice: number;

  /** Giá niêm yết (gạch ngang), luôn >= selling_price */
  @Column({
    name: 'display_price',
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  displayPrice: number;

  @ManyToOne(() => ProductSkuEntity, (sku) => sku.prices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_sku_id' })
  productSku?: ProductSkuEntity;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy?: UserEntity | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
