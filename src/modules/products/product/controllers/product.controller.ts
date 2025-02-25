import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../services/impl/product.service';


@Controller('products')
export class ProductController {

  constructor(
    private readonly productService: ProductService,
  ) {}

  @Get('')
  async getAll(): Promise<[]> {
    throw new Error('Not implemented');
  }
}
