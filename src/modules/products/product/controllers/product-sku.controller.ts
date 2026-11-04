import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { IProductSkuService } from '../services/product-sku.service.interface'

@ApiTags('Product SKUs')
@Public()
@Controller('skus')
export class ProductSkuController {
  constructor(
    @Inject('IProductSkuService')
    private readonly productSkuService: IProductSkuService
  ) {}

  @Get(':id')
  async getOneById(@Param('id') id: number) {    return await this.productSkuService.getOneById(id)
  }

  @Get()
  async getData(@Query('productId') productId: number) {    return await this.productSkuService.getAllByProductId(productId)
  }

  @Get(':id/prices')
  async getPrices(@Query('current') current: boolean, @Param('id') id: number) {    if (current) {
      return await this.productSkuService.getCurrentPriceById(id)
    }
    return await this.productSkuService.getPricesById(id)
  }
}
