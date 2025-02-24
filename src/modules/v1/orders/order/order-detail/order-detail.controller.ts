import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
} from '@nestjs/common';
import { IOrderDetailService } from './order-detail.service.interface';
import { OrderDetailEntity } from '../order-detail.entity';

@Controller('order-detail')
export class OrderDetailController {
  constructor(
    @Inject('IOrderDetailService')
    private readonly orderDetailService: IOrderDetailService,
  ) {}

  @Post('create')
  async createOrderDetail(
    @Body() orderDetail: OrderDetailEntity,
  ): Promise<OrderDetailEntity> {
    return await this.orderDetailService.createOne(orderDetail);
  }

  @Put('update/:id')
  async updateOrderDetailById(
    @Param('id') id: number,
    @Body() OrderDetailEntity: OrderDetailEntity,
  ): Promise<OrderDetailEntity> {
    return this.orderDetailService.updateOneById(id, OrderDetailEntity);
  }

  @Delete('delete/:id')
  async deleteOrderDetailById(@Param('id') id: number): Promise<void> {
    console.log(await this.orderDetailService.deleteOneById(id));
  }

  @Get(':id')
  async getOrderDetail(@Param('id') id: number): Promise<OrderDetailEntity[]> {
    return await this.orderDetailService.findOrderDetailByOrderId(id);
  }
}
