import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { IOrderDetailService } from './order-detail.service.interface';
import { OrderDetailEntity } from '../order-detail.entity';




// working with DTO
@Controller('order-detail') 
export class OrderDetailController {
    
    constructor(@Inject('IOrderDetailService')
        private orderDetailService: IOrderDetailService
    ) {}

    @Post('create')
    async createOrderDetail(@Body() orderDetail: OrderDetailEntity): Promise<OrderDetailEntity> {
        return await this.orderDetailService.createOne(orderDetail);
    }


    @Put('update/:id')
    async updateOrderDetailById(@Param('id') id: number, @Body() OrderDetailEntity: OrderDetailEntity): Promise<OrderDetailEntity> {
        return this.orderDetailService.updateOneById(id, OrderDetailEntity);
    }


    @Delete('delete/:id')
    async deleteOrderDetailById(@Param('id') id: number): Promise<void> {
        console.log(await this.orderDetailService.deleteOneById(id));
    }

    
    // @Get('get-order-details')
    // async getOrderDetails(): Promise<OrderDetailEntity[]> {
    //     return await this.orderDetailService.findOrderDetailByOrderId(5);
    // }


    @Get(':id')
    async getOrderDetail(@Param('id') id: number): Promise<OrderDetailEntity> {
        return await this.orderDetailService.getOneById(id);
    }
}