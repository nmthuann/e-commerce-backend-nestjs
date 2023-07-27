import { IBaseService } from "../../bases/base.interface";
import { ProductDto } from "./product-dto/product.dto";


export interface IProductService extends IBaseService<ProductDto>{
}