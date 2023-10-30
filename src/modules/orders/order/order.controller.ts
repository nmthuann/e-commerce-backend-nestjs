import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';

import { IOrderService } from './order.service.interface';
import { OrderEntity } from './order.entity';
import { GetTaskOrdersDto } from './order-dto/get-task-orders.dto';
import { GetCustomerListDto } from 'src/modules/users/user/user-dto/get-customer-list.dto';
import { RevenueByMonth } from './order-dto/order.dto';
import { OrderOfflineDto } from './order-dto/order-offline.dto';
import { AdminRoleGuard } from 'src/common/guards/admin.role.guard';
// import { GraphData } from './order.service';

// working with DTO
@Controller('order')
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private orderService: IOrderService,
  ) {}

  // @UseGuards(AdminRoleGuard)
  // @Post('create-offline')
  // async createOrder(@Body() order: OrderOfflineDto) {
  //   console.log(order);
  //   return await this.orderService.createNewOrderOffline(order);
  // }


  // @Put('update/:id')
  // async updateOrderById(
  //   @Param('id') id: number,
  //   @Body() orderEntity: OrderEntity,
  // ): Promise<OrderEntity> {
  //   return this.orderService.updateOneById(id, orderEntity);
  // }

  // @Delete('delete/:id')
  // async deleteOrderById(@Param('id') id: number): Promise<void> {
  //   console.log(await this.orderService.deleteOneById(id));
  // }


  @UseGuards(AdminRoleGuard)
  @Patch('update-confirmed/:order_id')
  // http://localhost:3333/order/update-confirmed/2041
  async updateConfirmedOrder(
    @Request() req: any,
    @Param('order_id') order_id: number,
  ): Promise<OrderEntity> {
    console.log("handleConfirmedOrder:::")
    const employee_email = req['email']; 
    return await this.orderService.handleConfirmedOrder(order_id, employee_email);
  }


  @UseGuards(AdminRoleGuard)
  @Patch('update-canceled/:order_id')
  async updateCanceledOrder(
    @Request() req: any,
    @Param('order_id') order_id: number,
  ): Promise<OrderEntity> {
    console.log("handleCanceledOrder:::")
    const employee_email = req['email']; 
    return await this.orderService.handleCanceledOrder(order_id, employee_email);
  }


  @Patch('update-inprogress/:order_id')
  async updateInProgressOrder(
    @Param('order_id') order_id: number,
  ): Promise<OrderEntity> {
    console.log("handleInProgressOrder:::")
    return await this.orderService.handleInProgressOrder(order_id);
  }


  @Patch('update-completed/:order_id')
  async updateCompletedOrder(
    @Param('order_id') order_id: number,
  ): Promise<OrderEntity> {
    return await this.orderService.handleCompletedOrder(order_id);
  }


  @Patch('update-refunded/:order_id')
  async updateRefundedOrder(
    @Param('order_id') order_id: number,
  ): Promise<OrderEntity> {
    return await this.orderService.handleRefundedOrder(order_id);
  }


  @Get('get-orders')
  async getOrders(): Promise<OrderEntity[]> {
    return await this.orderService.getAll();
  }

  @Get('get-task-orders')
  async getTaskOrders(): Promise<GetTaskOrdersDto[]> {
    return await this.orderService.getTaskOrders();
  }

  @Get('get-example-order')
  async getExample(): Promise<number> {
    return await this.orderService.getCountOrderCanceledByUserId(7);
  }

  @Get('get-customer-list')
  async getCustomerList(): Promise<GetCustomerListDto[]> {
    return await this.orderService.getCustomerList();
  }

  @Get('get-total-revenue')
  async getTotalRevenue(): Promise<number> {
    return await this.orderService.getTotalRevenue();
  }

  @Get('count-product-sold')
  async getCountProductSold(): Promise<number> {
    return await this.orderService.getCountProductSold();
  }

  @Get('get-orders-has-completed-status')
  async getOrdersHasCompletedStatus(): Promise<OrderEntity[]> {
    return await this.orderService.getOrdersHasCompletedStatus();
  }

  @Get('get-revenue-by-month')
  async getRevenueByMonth(): Promise<RevenueByMonth> {
    return await this.orderService.getRevenueByMonth();
  }

  @Get('get-total-price/:order_id')
  async getTotalPrice(@Param('order_id') order_id: number) {
    return await this.orderService.getTotalPriceByOrderId(order_id);
  }

  @Get(':id')
  async getOrder(@Param('id') id: number): Promise<OrderEntity> {
    return await this.orderService.getOneById(id);
  }
}
