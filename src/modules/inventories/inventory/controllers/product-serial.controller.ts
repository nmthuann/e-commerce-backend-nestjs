import { Controller, Get, Inject, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Positions } from 'src/common/decorators/roles.decorator'
import { Position } from 'src/common/enums/role.enum'
import { IProductSerialService } from '../services/product-serial.service.interface'
import { GetProductSerialsQueryDto } from '../domain/dtos/get-product-serials-query.dto'

@ApiTags('Product Serials')
@Positions(Position.WAREHOUSE)
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
