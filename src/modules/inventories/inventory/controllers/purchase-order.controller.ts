import { Body, Controller, Get, HttpCode, Inject, Param, Post, Query, Request, UseGuards } from '@nestjs/common'
import { IPurchaseOrderService } from '../services/purchase-order.service.interface'
import { CreatePurchaseOrderDto } from '../domain/dtos/create-purchase-order.dto'
import { UserRequest } from 'src/modules/users/domain/dtos/request/user.request'
import { AdminRoleGuard } from 'src/guards/admin-role.guard'
import { CreatePurchaseOrderDetailDto } from '../domain/dtos/create-purchase-order-detail.dto'
import { GetPurchaseOrdersQueryDto } from '../domain/dtos/get-purchase-orders-query.dto'

@Controller('purchaseOrders')
export class PurchaseOrderController {
  constructor(
    @Inject('IPurchaseOrderService')
    private readonly purchaseOrderService: IPurchaseOrderService
  ) {}

  @Get()
  async getData(@Query() query: GetPurchaseOrdersQueryDto) {
    console.log(query)
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
  @UseGuards(AdminRoleGuard)
  async createOne(@Request() req: UserRequest, @Body() data: CreatePurchaseOrderDto) {
    console.log(`<ADMIN> ::: ${req.userId} Đã vừa Thực hiện!, ${JSON.stringify(data)}`)
    return await this.purchaseOrderService.createOne(req.userId, data)
  }

  @Post(':id/purchaseOrderDetails')
  @HttpCode(201)
  @UseGuards(AdminRoleGuard)
  async createPurchaseOrderDetailById(
    @Request() req: UserRequest,
    @Param('id') id: number,
    @Body() data: CreatePurchaseOrderDetailDto
  ) {
    console.log(`<ADMIN> ::: ${req.userId} Đã vừa Thực hiện!, ${JSON.stringify(data)}`)
    return await this.purchaseOrderService.createPurchaseOrderDetailById(id, data)
  }
}
