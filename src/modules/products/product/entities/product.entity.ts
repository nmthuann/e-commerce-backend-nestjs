import { BaseEntity } from 'src/modules/bases/base.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,

  JoinColumn,
  ManyToOne,
  OneToMany,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';
import { CategoryEntity } from '../../category/category.entity';
// import { ProductDetailEntity } from "./product-detail.entity"
import { ImageEntity } from '../../image/image.entity';
import { DiscountEntity } from '../../discount/discount.entity';

import { ErrorInput } from 'src/common/errors/errors';

@Entity({ name: 'Products' })
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ nullable: false })
  model_name: string;

  @Column({ default: 0 })
  vote: number;

  @Column({ default: 0, nullable: false })
  price: number;

  @Column({ default: 0, nullable: false })
  unit_price: number;

  @Column({ nullable: false, default: 0 })
  quantity: number;

  @Column({ default: true })
  status: boolean;

  /**
   * Chi tiết sản phẩm
   */

  @Column()
  description: string;
  @Column({ type: 'nvarchar', length: 100, nullable: false })
  operation_system: string; //  thương hiệu
  @Column({ type: 'nvarchar', length: 100, nullable: false })
  hardware: string; //  xuất xứ
  @Column()
  warranty_time: number; // thới gian bảo hành

  @OneToMany(() => ImageEntity, (image) => image.product)
  //@JoinColumn({name: 'image_id'})
  images?: ImageEntity[];

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    eager: true,
  }) //
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => DiscountEntity, (discount) => discount.products, {
    eager: true,
  }) //, { lazy: true }
  @JoinColumn({ name: 'discount_id' })
  discount: DiscountEntity;

  @BeforeInsert()
  @BeforeUpdate()
  validateUnitPrice() {
    if (this.unit_price > this.price) {
      throw new Error(ErrorInput.PRICE_INVALID);
    }
  }

  /**
   * bổ sung
   * 1. color: nvachar 50
   * 2. battery: int
   * 3. screen: decimal(10, 2)
   * 4. memory: int
   * 5. front_camera: int
   * 6. behind_camera: int
   * 7. ram: int
   */

  @Column({ type: 'nvarchar', length: 50, nullable: false })
  color: string;

  @Column({ type: 'int', nullable: false })
  battery: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  screen: number;

  @Column({ type: 'int', nullable: false })
  memory: number;

  @Column({ type: 'int', nullable: false })
  front_camera: number;

  @Column({ type: 'int', nullable: false })
  behind_camera: number;

  @Column({ type: 'int', nullable: false })
  ram: number;

  // @ManyToOne(() => CartDetailEntity, (cart_detail) => cart_detail.products)
  // cart_detail: CartDetailEntity
}
