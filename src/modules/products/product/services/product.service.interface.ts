import { CreateProductDto } from "src/modules/v1/products/product/product-dto/create-product.dto";
import { ProductDto } from "../domain/dtos/product.dto";
import { SkuDto } from "../domain/dtos/sku.dto";
import { Page } from "src/common/dtos/page.dto";
import { ProductPageOptionsDto } from "../domain/dtos/requests/product-page-options.dto";

export interface IProductService {
    createOne(data: CreateProductDto): Promise<ProductDto>;
    getProductsWithPagination(productPageOptionsDto: ProductPageOptionsDto): Promise<Page<ProductDto>>;
    getOneById(id: number): Promise<ProductDto>;
    getProductsBySku(skuId: number): Promise<SkuDto[]>;
}