import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { ProductSkuEntity } from 'src/modules/products/product/domain/entities/product-sku.entity'
import { IsPositive } from 'class-validator'
import { UserEntity } from 'src/modules/users/user/user.entity'

@Entity({ name: 'cart_items' })
export class CartItemEntity {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string

  @PrimaryColumn({ name: 'product_sku_id', type: 'int' })
  productSkuId: number

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @ManyToOne(() => ProductSkuEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_sku_id' })
  productSku: ProductSkuEntity

  @Column({ type: 'int' })
  @IsPositive()
  quantity: number

  @Column({ name: 'price_at_added', type: 'double precision' })
  priceAtAdded: number

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt: Date
}
