import { Controller, Get } from '@nestjs/common'
import { OrderEntity } from '../domain/entities/order.entity'
import { OrdersService } from '../services/impl/orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('all')
  async getAll(): Promise<OrderEntity[]> {
    return await this.ordersService.getAll()
  }
}
