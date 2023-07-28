import { BaseEntity } from "src/modules/bases/base.entity"
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany, BeforeUpdate, BeforeInsert } from "typeorm"
import { CategoryEntity } from "../../category/category.entity"
// import { ProductDetailEntity } from "./product-detail.entity"
import { ImageEntity } from "../../image/image.entity"
import { DiscountEntity } from "../../discount/discount.entity"
import { CartDetailEntity } from "src/modules/orders/cart/cart-detail.entity"


@Entity({name: 'Products'})
export class ProductEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    product_id: number

    @Column({nullable: false})
    product_name: string

    @Column({ default: 0 })
    vote: number

    @Column({default: 0, nullable: false})
    price: number

    @Column({default: 0, nullable: false})
    unit_price: number

    @Column({nullable: false, default: 0})
    quantity: number

    @Column({ default: true })
    status: boolean

    


    /**
     * Chi tiết sản phẩm
     */

    @Column()
    description: string;
    @Column({type: "nvarchar", length: 100, nullable: false})
    brand: string;  //  thương hiệu
    @Column({type: "nvarchar", length: 100, nullable: false})
    origin: string;  //  xuất xứ
    @Column()
    warranty_time: number  // thới gian bảo hành


    @OneToMany(() => ImageEntity, image => image.product)
    @JoinColumn({name: 'image_id'})
    images: ImageEntity[];

    @ManyToOne(() => CategoryEntity, (category) => category.products, { lazy: true }, )
    category: CategoryEntity

    @ManyToOne(() => DiscountEntity, (discount) => discount.products, { lazy: true },)
    discount: DiscountEntity



    @BeforeInsert()
    @BeforeUpdate()
    validateUnitPrice() {
        if (this.unit_price > this.price) {
            throw new Error("Unit price must be less than price");
        }
    }


    // @ManyToOne(() => CartDetailEntity, (cart_detail) => cart_detail.products)
    // cart_detail: CartDetailEntity
}
