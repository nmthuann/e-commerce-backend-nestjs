import { Body, Controller, HttpCode, Inject, Post, Request, UseGuards } from '@nestjs/common'
import { IPurchaseOrderService } from '../services/purchase-order.service.interface'
import { CreatePurchaseOrderDto } from '../domain/dtos/create-purchase-order.dto'
import { UserRequest } from 'src/modules/users/domain/dtos/request/user.request'
import { AdminRoleGuard } from 'src/guards/admin-role.guard'

@Controller('purchaseOrders')
export class PurchaseOrderController {
  constructor(
    @Inject('IPurchaseOrderService')
    private readonly purchaseOrderService: IPurchaseOrderService
  ) {}

  @Post('')
  @HttpCode(201)
  @UseGuards(AdminRoleGuard)
  async createOne(@Request() req: UserRequest, @Body() data: CreatePurchaseOrderDto) {
    console.log(`<ADMIN> ::: ${req.userId} Đã vừa Thực hiện!, ${JSON.stringify(data)}`)
    return await this.purchaseOrderService.createOne(req.userId, data)
  }
}
