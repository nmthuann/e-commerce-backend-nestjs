import { ProductDto } from '../domain/dtos/product.dto'
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto'
import { PageDto } from 'src/common/dtos/page.dto'
import { ProductResponse } from '../domain/dtos/responses/product.response'
import { CreateProductDto } from '../domain/dtos/requests/create-product.dto'
import { SpuSkuMappingDto } from '../domain/dtos/spu-sku-mapping.dto'

export interface IProductService {
  createOne(data: CreateProductDto): Promise<ProductDto>
  getProductsWithPagination(query: GetProductsQueryDto): Promise<PageDto<ProductResponse>>
  getOneById(id: number): Promise<ProductDto>
  getProductBySlug(slug: string): Promise<SpuSkuMappingDto>
}
