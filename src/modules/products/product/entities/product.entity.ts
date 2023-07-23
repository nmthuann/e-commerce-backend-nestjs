import { BaseEntity } from "src/modules/bases/base.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { CategoryEntity } from "../../category/category.entity"
import { ProductDetailEntity } from "./product-detail.entity"
import { ImageEntity } from "./image.entity"
import { DiscountEntity } from "../../product-discount/discount.entity"


@Entity({name: 'Products'})
export class ProductEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    product_id: number

    @Column({nullable: false})
    product_name: string

    @Column({ default: 0 })
    vote: number

    @Column({nullable: false})
    price: number

    @Column()
    quantity: number

    @OneToMany(() => ImageEntity, image => image.product)
    images: ImageEntity[];

    @ManyToOne(() => CategoryEntity, (category) => category.products, { lazy: true })
    category: CategoryEntity

    @OneToOne(() => DiscountEntity)
    @JoinColumn({name: 'discount_id'})
    discount: DiscountEntity

    @OneToOne(() => ProductDetailEntity, (product_detail) => product_detail.product)
    @JoinColumn()
    product_detail: ProductDetailEntity
}
