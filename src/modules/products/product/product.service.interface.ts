import { IBaseService } from "../../bases/base.interface";
import { ProductEntity } from "./entities/product.entity";
import { GetProductForOrderDto } from "./product-dto/get-product-order.dto";
import { ProductFilterDto } from "./product-dto/product-filter.dto";
import { ProductDto } from "./product-dto/product.dto";


export interface IProductService extends IBaseService<ProductEntity>{
    getSomeFields(): Promise<Partial<ProductEntity>[]> ;
    getProductsByOptions(data: any): Promise<Partial<ProductEntity>[]> ;
    getProductsByCategoryId(category_id: number): Promise<ProductEntity[]>;
    getProductsByPriceRange(category_id: number, maxPrice: number): Promise<ProductEntity[]>;
    getProductsByBrand(category_id: number, brand: string): Promise<ProductEntity[]>;
    getProductsByFilter(category_id: number, options: ProductFilterDto): Promise<ProductEntity[]>;
    getProductBrandByCategoryId(category_id: number): Promise<string[]>;
    getProductsByIds(data: GetProductForOrderDto[]): Promise<ProductEntity[]>;
    //getProductBrandByCategoryId(category_id: number): Promise<string[]>;
    // updateQuantity()
    getProductsByProductIds(ids: number[]): Promise<ProductEntity[]>;

}