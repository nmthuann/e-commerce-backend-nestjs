import { IBaseService } from "../../bases/base.interface";
import { ProductEntity } from "./entities/product.entity";
import { ProductDto } from "./product-dto/product.dto";


export interface IProductService extends IBaseService<ProductEntity>{
}