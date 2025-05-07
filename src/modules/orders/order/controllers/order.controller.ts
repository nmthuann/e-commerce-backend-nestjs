import { Controller, Get, HttpCode, Inject, Param, Post, Query, UseGuards, Request, Body, Put } from '@nestjs/common'
import { IOrderService } from '../services/order.service.interface'
import { GetOrdersQueryDto } from '../domain/dtos/get-orders-query.dto'
import { UserRoleGuard } from 'src/guards/user-role.guard'
import { UserRequest } from 'src/modules/users/domain/dtos/request/user.request'
import { CreateOrderDto } from '../domain/dtos/create-order.dto'
import { AdminRoleGuard } from 'src/guards/admin-role.guard'

@Controller('orders')
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService
  ) {}

  @Get('')
  async getAll(@Query() query: GetOrdersQueryDto) {
    console.log('order - query:::', query)
    return await this.orderService.getAllWithPagination(query)
  }

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    console.log('getOneById:::', id)
    return await this.orderService.getOneById(id)
  }

  @Post('')
  @HttpCode(201)
  @UseGuards(UserRoleGuard)
  async createOne(@Request() req: UserRequest, @Body() data: CreateOrderDto) {
    console.log(`<USER> ::: ${req.userId} Đã vừa Thực hiện, Create Order!`)
    return await this.orderService.createOne(req.userId, data)
  }

  @Put('/:id')
  @HttpCode(201)
  @UseGuards(AdminRoleGuard)
  async updateOneById(@Request() req: UserRequest, @Param('id') id: number, @Body() data: CreateOrderDto) {
    console.log(`<USER> ::: ${req.userId} Đã vừa Thực hiện, Create Order!`)
    return await this.orderService.updateOneById(id, req.userId, data)
  }
}
