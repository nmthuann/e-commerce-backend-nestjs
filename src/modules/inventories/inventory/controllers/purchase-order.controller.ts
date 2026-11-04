import { Body, Controller, Get, HttpCode, Inject, Param, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Positions } from 'src/common/decorators/roles.decorator'
import { Position } from 'src/common/enums/role.enum'
import { IPurchaseOrderService } from '../services/purchase-order.service.interface'
import { CreatePurchaseOrderDto } from '../domain/dtos/create-purchase-order.dto'
import { CreatePurchaseOrderDetailDto } from '../domain/dtos/create-purchase-order-detail.dto'
import { GetPurchaseOrdersQueryDto } from '../domain/dtos/get-purchase-orders-query.dto'

@ApiTags('Purchase Orders')
@Positions(Position.WAREHOUSE)
@Controller('purchaseOrders')
export class PurchaseOrderController {
  constructor(
    @Inject('IPurchaseOrderService')
    private readonly purchaseOrderService: IPurchaseOrderService
  ) {}

  @Get()
  async getData(@Query() query: GetPurchaseOrdersQueryDto) {
    if (query.orderNumber) {
      return await this.purchaseOrderService.getOneByOrderNumber(query.orderNumber)
    }
    return await this.purchaseOrderService.getAllWithPagination(query)
  }

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    return await this.purchaseOrderService.getOneById(id)
  }

  @Post('')
  @HttpCode(201)
  async createOne(@CurrentUser('sub') userId: string, @Body() data: CreatePurchaseOrderDto) {
    return await this.purchaseOrderService.createOne(userId, data)
  }

  @Post(':id/purchaseOrderDetails')
  @HttpCode(201)
  async createPurchaseOrderDetailById(@Param('id') id: number, @Body() data: CreatePurchaseOrderDetailDto) {
    return await this.purchaseOrderService.createPurchaseOrderDetailById(id, data)
  }
}
