import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'
import { BrandDto } from './brand.dto';
import { IBrandService } from './brand.service.interface';

@ApiTags('Brands')
@Public()
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
