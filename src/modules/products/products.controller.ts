import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { SpuSkuMappingEntity } from './entities/spu-sku-mapping.entity';


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
