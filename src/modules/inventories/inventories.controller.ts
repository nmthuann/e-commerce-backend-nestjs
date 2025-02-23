import { Controller, Get } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { ProductSerialEntity } from './entities/product-serial.entity';


@Controller('inventories')
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}
  @Get('all')
  async getAll(): Promise<ProductSerialEntity[]> {
    return await this.inventoriesService.getAll();
  }
}
