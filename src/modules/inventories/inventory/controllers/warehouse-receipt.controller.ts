import { Controller, Get, HttpCode, Inject, Param, Post, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Positions } from 'src/common/decorators/roles.decorator'
import { Position } from 'src/common/enums/role.enum'
import { IWarehouseReceiptService } from '../services/warehouse-receipt.service.interface'
import { CreateWarehouseReceiptDto } from '../domain/dtos/create-warehouse-receipt.dto'
import { CreateProductSerialDto } from '../domain/dtos/create-product-serial.dto'
import { GetWarehouseReceiptsQueryDto } from '../domain/dtos/get-warehouse-receipts-query.dto'

@ApiTags('Warehouse Receipts')
@Positions(Position.WAREHOUSE)
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
  async createOne(@CurrentUser('sub') userId: string, @Body() data: CreateWarehouseReceiptDto) {
    return await this.warehouseReceiptrService.createOne(userId, data)
  }

  @Post(':id/productSerials')
  @HttpCode(201)
  async createPurchaseOrderDetailById(@Param('id') id: number, @Body() data: CreateProductSerialDto) {
    return await this.warehouseReceiptrService.createProductSerialById(id, data)
  }

  @Get()
  async getData(@Query() query: GetWarehouseReceiptsQueryDto) {
    if (query.receiptNumber) {
      return await this.warehouseReceiptrService.getOneByReceiptNumber(query.receiptNumber)
    }
    return await this.warehouseReceiptrService.getAllWithPagination(query)
  }
}
