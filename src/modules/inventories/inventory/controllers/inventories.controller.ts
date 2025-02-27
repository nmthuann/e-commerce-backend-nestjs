import { Controller, Get } from '@nestjs/common'
import { ProductSerialEntity } from '../../entities/product-serial.entity'
import { InventoriesService } from '../services/inventories.service'

@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}
  @Get('all')
  async getAll(): Promise<ProductSerialEntity[]> {
    return await this.inventoriesService.getAll()
  }
}
