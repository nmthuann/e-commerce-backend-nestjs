import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards,Request } from '@nestjs/common';

import { IOrderService } from './order.service.interface';
import { OrderEntity } from './order.entity';
import { CreateOrderDto } from './order-dto/create-order.dto';
import { GetTaskOrdersDto } from './order-dto/get-task-orders.dto';
import { GetCustomerListDto } from 'src/modules/users/user/user-dto/get-customer-list.dto';
import { RevenueByMonth } from './order-dto/order.dto';
import { AdminRoleGuard } from 'src/common/guards/admin.role.guard';
import { UserRoleGuard } from 'src/common/guards/user.role.guard';
import { OrderOfflineDto } from './order-dto/order-offline.dto';
// import { GraphData } from './order.service';


// working with DTO
@Controller('order') 
export class OrderController {
    
    constructor(@Inject('IOrderService')
        private orderService: IOrderService
    ) {}


    // @UseGuards(AdminRoleGuard)
    @Post('create-offline')
    async createOrder( @Body() order: OrderOfflineDto){ //: Promise<OrderEntity> { //@Request() req: any,
        // const email = req['email'];
        // console.log(email);
        
        // order.order_detail = order.order_detail.map(item => ({
        //     product_id: parseInt(item.product_id),
        //     quantity: parseInt(item.quantity)
        // }));

        console.log(order)
        return await this.orderService.createNewOrderOffline(order);
    }

    // @UseGuards(UserRoleGuard)
    // @Post('create-online')
    // async createNewOrderOnline(@Body() order: CreateOrderDto): Promise<OrderEntity> {
    //     return await this.orderService.createNewOrderOnline();
    // }


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


    // @UseGuards(AdminRoleGuard)
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


    //@UseGuards(AdminRoleGuard)
    @Get('get-total-revenue')
    async getTotalRevenue(): Promise<number> {
        return await this.orderService.getTotalRevenue();
    }

    //@UseGuards(AdminRoleGuard)
    @Get('count-product-sold')
    async getCountProductSold(): Promise<number> {
        return await this.orderService.getCountProductSold();
    }


    @Get('get-orders-has-completed-status')
    async getOrdersHasCompletedStatus(): Promise<OrderEntity[]> {
        return await this.orderService.getOrdersHasCompletedStatus();
    }


    // @UseGuards(AdminRoleGuard)
    @Get('get-revenue-by-month')
    async getRevenueByMonth(): Promise<RevenueByMonth> {
        return await this.orderService.getRevenueByMonth();
    }


    @Get(':id')
    async getOrder(@Param('id') id: number): Promise<OrderEntity> {
        return await this.orderService.getOneById(id);
    }
}