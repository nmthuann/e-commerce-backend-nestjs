import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';

import { IOrderService } from './order.service.interface';
import { OrderEntity } from './order.entity';
import { CreateOrderDto } from './order-dto/create-order.dto';
import { GetTaskOrdersDto } from './order-dto/get-task-orders.dto';


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


    @Get(':id')
    async getOrder(@Param('id') id: number): Promise<OrderEntity> {
        return await this.orderService.getOneById(id);
    }
}