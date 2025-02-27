import { Controller, Get, Inject, Query } from '@nestjs/common'
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto'
import { IProductService } from '../services/product.service.interface'

@Controller('products')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService
  ) {}

  @Get()
  async getData(@Query() query: GetProductsQueryDto) {
    console.log(query)
    if (query.slug) {
      return await this.productService.getProductBySlug(query.slug)
    }
    return await this.productService.getProductsWithPagination(query)
  }
}
