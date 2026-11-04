import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto'
import { IProductService } from '../services/product.service.interface'

@ApiTags('Products')
@Public()
@Controller('products')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService
  ) {}

  @Get()
  async getData(@Query() query: GetProductsQueryDto) {    if (query.slug) {
      return await this.productService.getProductBySlug(query.slug)
    }
    return await this.productService.getAllWithPagination(query)
  }
}
