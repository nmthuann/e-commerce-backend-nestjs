import { CreateProductDto } from 'src/modules/v1/products/product/product-dto/create-product.dto'
import { ProductDto } from '../domain/dtos/product.dto'
import { SkuDto } from '../domain/dtos/sku.dto'
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto'
import { PageDto } from 'src/common/dtos/page.dto'
import { ProductResponse } from '../domain/dtos/responses/product.response'

export interface IProductService {
  createOne(data: CreateProductDto): Promise<ProductDto>
  getProductsWithPagination(query: GetProductsQueryDto): Promise<PageDto<ProductResponse>>
  getOneById(id: number): Promise<ProductDto>
  getProductsBySku(skuId: number): Promise<SkuDto[]>
}
