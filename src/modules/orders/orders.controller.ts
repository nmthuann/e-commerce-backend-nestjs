import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
export class OrdersController {

  constructor(
    private readonly ordersService: OrdersService,
  ) {}

  @Get('all')
  async getAll(): Promise<OrderEntity[]> {
    return await this.ordersService.getAll();
  }
}
