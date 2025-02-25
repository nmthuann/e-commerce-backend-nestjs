import { Controller, Get } from '@nestjs/common';
import { SpuSkuMappingEntity } from '../domain/entities/spu-sku-mapping.entity';
import { ProductsService } from '../services/impl/products.service';


@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get('all')
  async getAll(): Promise<SpuSkuMappingEntity[]> {
    return await this.productsService.getAll();
  }
}
