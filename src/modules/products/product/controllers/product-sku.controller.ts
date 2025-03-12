import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
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

  @Get()
  async getData(@Query('productId') productId: number) {
    console.log('productId:::', productId)
    return await this.productSkuService.getAllByProductId(productId)
  }

  @Get(':id/prices')
  async getPrices(@Param('id') id: number) {
    console.log('skuID:::', id)
    return await this.productSkuService.getPricesById(id)
  }
}
