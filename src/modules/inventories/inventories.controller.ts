import { Controller, Get } from '@nestjs/common';
import { InventoriesService } from './inventories.service';


@Controller()
export class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Get()
  getHello(): string {
    return this.inventoriesService.getInformation();
  }
}
