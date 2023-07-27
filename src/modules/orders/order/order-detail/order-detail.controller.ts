import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { IOrderDetailService } from './order-detail.service.interface';
import { OrderDetailDto } from '../order-dto/order-detail.dto';



// working with DTO
@Controller('order-detail') 
export class OrderDetailController {
    
    constructor(@Inject('IOrderDetailService')
        private orderDetailService: IOrderDetailService
    ) {}

    @Post('create')
    async createOrderDetail(@Body() orderDetail: OrderDetailDto): Promise<OrderDetailDto> {
        return await this.orderDetailService.createOne(orderDetail);
    }


    @Put('update/:id')
    async updateOrderDetailById(@Param('id') id: number, @Body() orderDetailDto: OrderDetailDto): Promise<OrderDetailDto> {
        return this.orderDetailService.updateOneById(id, orderDetailDto);
    }


    @Delete('delete/:id')
    async deleteOrderDetailById(@Param('id') id: number): Promise<void> {
        console.log(await this.orderDetailService.deleteOneById(id));
    }

    
    @Get('get-order')
    async getOrderDetails(): Promise<OrderDetailDto[]> {
        return await this.orderDetailService.getAll();
    }


    @Get(':id')
    async getOrderDetail(@Param('id') id: number): Promise<OrderDetailDto> {
        return await this.orderDetailService.getOneById(id);
    }
}