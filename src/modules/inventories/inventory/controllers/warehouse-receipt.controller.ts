import { Controller, Get, HttpCode, Inject, Param, Post, UseGuards, Request, Body } from '@nestjs/common'
import { IWarehouseReceiptService } from '../services/warehouse-receipt.service.interface'
import { AdminRoleGuard } from 'src/guards/admin-role.guard'
import { CreateWarehouseReceiptDto } from '../domain/dtos/create-warehouse-receipt.dto'
import { UserRequest } from 'src/modules/users/domain/dtos/request/user.request'
import { CreateProductSerialDto } from '../domain/dtos/create-product-serial.dto'

@Controller('warehouseReceipts')
export class WarehouseReceiptController {
  constructor(
    @Inject('IWarehouseReceiptService')
    private readonly warehouseReceiptrService: IWarehouseReceiptService
  ) {}

  @Get(':id')
  async getOneById(@Param('id') id: number) {
    return await this.warehouseReceiptrService.getOneById(id)
  }

  @Post('')
  @HttpCode(201)
  @UseGuards(AdminRoleGuard)
  async createOne(@Request() req: UserRequest, @Body() data: CreateWarehouseReceiptDto) {
    console.log(`<ADMIN> ::: ${req.userId} Đã vừa Thực hiện!, ${JSON.stringify(data)}`)
    return await this.warehouseReceiptrService.createOne(req.userId, data)
  }

  @Post(':id/productSerials')
  @HttpCode(201)
  @UseGuards(AdminRoleGuard)
  async createPurchaseOrderDetailById(
    @Request() req: UserRequest,
    @Param('id') id: number,
    @Body() data: CreateProductSerialDto
  ) {
    console.log(`<ADMIN> ::: ${req.userId} Đã vừa Thực hiện!, ${JSON.stringify(data)}`)
    return await this.warehouseReceiptrService.createProductSerialById(id, data)
  }
}
