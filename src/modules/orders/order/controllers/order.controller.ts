import { Controller, Get, Inject, Param, Query } from '@nestjs/common'
import { IOrderService } from '../services/order.service.interface'
import { GetOrdersQueryDto } from '../domain/dtos/get-orders-query.dto'

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService
  ) {}

  @Get('')
  async getAll(@Query() query: GetOrdersQueryDto) {
    console.log('order - query:::', query)
    return await this.orderService.getAllWithPagination(query)
  }

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    console.log('getOneById:::', id)
    return await this.orderService.getOneById(id)
  }
}
