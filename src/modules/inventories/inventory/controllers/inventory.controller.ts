import { Controller, Get, Inject, Query } from '@nestjs/common'
import { IInventoryService } from '../services/inventory.service.interface'

@Controller('inventories')
export class InventoryController {
  constructor(
    @Inject('IInventoryService')
    private readonly inventoryService: IInventoryService
  ) {}

  @Get()
  async getStock(@Query('productSkuId') productSkuId: number): Promise<number> {
    console.log(typeof productSkuId)
    return await this.inventoryService.getStock(productSkuId)
  }
}
