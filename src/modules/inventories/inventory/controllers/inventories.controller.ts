import { Controller, Get } from '@nestjs/common'
import { ProductSerialEntity } from '../domain/entities/product-serial.entity'
import { InventoriesService } from '../services/impl/inventories.service'

@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}
  @Get('all')
  async getAll(): Promise<ProductSerialEntity[]> {
    return await this.inventoriesService.getAll()
  }
}
