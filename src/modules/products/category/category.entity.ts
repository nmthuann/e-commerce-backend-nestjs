import { BaseEntity } from "src/modules/bases/base.entity"
import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    OneToMany 
} from "typeorm"
import { ProductEntity } from "../product/entities/product.entity"


@Entity({name:'Categories'})
export class CategoryEntity extends BaseEntity { 
    @PrimaryGeneratedColumn()
    category_id: number

    @Column({nullable: false})
    category_name: string

    @Column()
    description: string
    
    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[]
}
    