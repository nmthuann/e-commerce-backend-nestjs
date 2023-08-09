import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';

import { IOrderService } from './order.service.interface';
import { OrderEntity } from './order.entity';
import { CreateOrderDto } from './order-dto/create-order.dto';
import { GetTaskOrdersDto } from './order-dto/get-task-orders.dto';
import { GetCustomerListDto } from 'src/modules/users/user/user-dto/get-customer-list.dto';
import { RevenueByMonth } from './order-dto/order.dto';
// import { GraphData } from './order.service';


// working with DTO
@Controller('order') 
export class OrderController {
    
    constructor(@Inject('IOrderService')
        private orderService: IOrderService
    ) {}

    @Post('create')
    async createOrder(@Body() order: CreateOrderDto): Promise<OrderEntity> {
        return await this.orderService.createNewOrder(order);
    }


    @Put('update/:id')
    async updateOrderById(@Param('id') id: number, @Body() OrderEntity: OrderEntity): Promise<OrderEntity> {
        return this.orderService.updateOneById(id, OrderEntity);
    }


    @Delete('delete/:id')
    async deleteOrderById(@Param('id') id: number): Promise<void> {
        console.log(await this.orderService.deleteOneById(id));
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
        // return await this.orderService.getCountOrdersByUserId(4);
        // return await this.orderService.getTotalPriceOfUser(7);
        return await this.orderService.getCountOrderCanceledByUserId(7);
    }


    @Get('get-customer-list')
    async getCustomerList(): Promise<GetCustomerListDto[]> {
        // return await this.orderService.getCountOrdersByUserId(4);
        // return await this.orderService.getTotalPriceOfUser(7);
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


    @Get(':id')
    async getOrder(@Param('id') id: number): Promise<OrderEntity> {
        return await this.orderService.getOneById(id);
    }
}