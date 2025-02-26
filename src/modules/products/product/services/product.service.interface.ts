import { ProductDto } from '../domain/dtos/product.dto'
import { SkuDto } from '../domain/dtos/sku.dto'
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto'
import { PageDto } from 'src/common/dtos/page.dto'
import { ProductResponse } from '../domain/dtos/responses/product.response'
import { CreateProductDto } from '../domain/dtos/requests/create-product.dto'
import { CreatePriceDto } from '../domain/dtos/requests/create-price.dto'

export interface IProductService {
  createOne(data: CreateProductDto): Promise<ProductDto>
  getProductsWithPagination(query: GetProductsQueryDto): Promise<PageDto<ProductResponse>>
  getOneById(id: number): Promise<ProductDto>
  getProductsBySku(skuId: number): Promise<SkuDto[]>
  createPriceBySkuId(skuId: number, data: CreatePriceDto): Promise<SkuDto>
}
