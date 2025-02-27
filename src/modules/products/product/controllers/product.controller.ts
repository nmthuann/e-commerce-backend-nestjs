import { Controller, Get, Inject, Query } from '@nestjs/common'
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto'
import { PageDto } from 'src/common/dtos/page.dto'
import { IProductService } from '../services/product.service.interface'
import { ProductResponse } from '../domain/dtos/responses/product.response'

@Controller('products')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService
  ) {}

  @Get()
  async getProducts(@Query() query: GetProductsQueryDto): Promise<PageDto<ProductResponse>> {
    console.log(query)
    return this.productService.getProductsWithPagination(query)
  }
}
