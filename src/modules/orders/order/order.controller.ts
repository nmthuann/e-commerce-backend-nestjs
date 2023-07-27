import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { OrderDto } from '../order/order-dto/order.dto';
import { IOrderService } from './order.service.interface';


// working with DTO
@Controller('order') 
export class OrderController {
    
    constructor(@Inject('IOrderService')
        private orderService: IOrderService
    ) {}

    @Post('create')
    async createOrder(@Body() order: OrderDto): Promise<OrderDto> {
        return await this.orderService.createOne(order);
    }


    @Put('update/:id')
    async updateOrderById(@Param('id') id: number, @Body() orderDto: OrderDto): Promise<OrderDto> {
        return this.orderService.updateOneById(id, orderDto);
    }


    @Delete('delete/:id')
    async deleteOrderById(@Param('id') id: number): Promise<void> {
        console.log(await this.orderService.deleteOneById(id));
    }

    
    @Get('get-order')
    async getOrders(): Promise<OrderDto[]> {
        return await this.orderService.getAll();
    }


    @Get(':id')
    async getOrder(@Param('id') id: number): Promise<OrderDto> {
        return await this.orderService.getOneById(id);
    }
}