import { Controller, Get, HttpCode, Inject, Param, Post, Query, Body, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Positions, Roles } from 'src/common/decorators/roles.decorator'
import { Position, Role } from 'src/common/enums/role.enum'
import { IOrderService } from '../services/order.service.interface'
import { GetOrdersQueryDto } from '../domain/dtos/get-orders-query.dto'
import { CreateOrderDto } from '../domain/dtos/create-order.dto'
import { UpdateOrderDto } from '../domain/dtos/update-order.dto'

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService
  ) {}

  @Get('')
  @Positions(Position.SALES)
  async getAll(@Query() query: GetOrdersQueryDto) {
    return await this.orderService.getAllWithPagination(query)
  }

  @Get(':id')
  @Positions(Position.SALES)
  async getOneById(@Param('id') id: number) {
    return await this.orderService.getOneById(id)
  }

  @Post('')
  @HttpCode(201)
  @Roles(Role.CUSTOMER)
  async createOne(@CurrentUser('sub') userId: string, @Body() data: CreateOrderDto) {
    return await this.orderService.createOne(userId, data)
  }

  @Put('/:id')
  @Positions(Position.SALES)
  async updateOneById(@CurrentUser('sub') userId: string, @Param('id') id: number, @Body() data: UpdateOrderDto) {
    return await this.orderService.updateOneById(id, userId, data)
  }
}
