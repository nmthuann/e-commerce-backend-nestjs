import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IProductSerialService } from '../services/product-serial.service.interface'
import { GetProductSerialsQueryDto } from '../domain/dtos/get-product-serials-query.dto'

@Controller('productSerials')
export class ProductSerialController {
  constructor(
    @Inject('IProductSerialService')
    private readonly productSerialService: IProductSerialService
  ) {}

  @Get()
  async getData(@Query() query: GetProductSerialsQueryDto) {
    if (query.isGetStock) {
      return await this.productSerialService.getStock(query.productSkuId)
    }
    return await this.productSerialService.getAllWithPagination(query)
  }
}
