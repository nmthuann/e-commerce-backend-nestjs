import { Controller, Get } from '@nestjs/common';
import { BrandEntity } from '../entities/brand.entity';
import { BrandService } from './brand.service';


@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}
  @Get('')
  async getAll(): Promise<BrandEntity[]> {
    return await this.brandService.getAll();
  }
}
