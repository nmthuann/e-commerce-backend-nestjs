import { Controller, Get, Inject, Query } from '@nestjs/common';
import { GetProductsQueryDto } from '../domain/dtos/requests/get-products-query.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { ProductDto } from '../domain/dtos/product.dto';
import { IProductService } from '../services/product.service.interface';


@Controller('products')
export class ProductController {

  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService,
  ) {}

  @Get()
  async getProducts(@Query() query: GetProductsQueryDto): Promise<PageDto<ProductDto>> {
    return this.productService.getProductsWithPagination(query);
  }
}
