import { Controller, Get, Inject } from '@nestjs/common';
import { BrandDto } from './brand.dto';
import { IBrandService } from './brand.service.interface';

@Controller('brands')
export class BrandController {
  constructor(
    @Inject('IBrandService')
    private readonly brandService: IBrandService,
  ) {}

  @Get()
  async getAll(): Promise<BrandDto[]> {
    return await this.brandService.getAll();
  }
}
