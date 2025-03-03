import { Controller, Get, Inject, Param } from '@nestjs/common'
import { IProductSkuService } from '../services/product-sku.service.interface'

@Controller('skus')
export class ProductSkuController {
  constructor(
    @Inject('IProductSkuService')
    private readonly productSkuService: IProductSkuService
  ) {}

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    console.log('id:::', id)
    return await this.productSkuService.getOneById(id)
  }
}
