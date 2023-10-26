import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Inject,
} from '@nestjs/common';
import { ShippingDto } from '../shipping/shipping.dto';
import { IShippingService } from './Shipping.service.interface';

// working with DTO
@Controller('shipping')
export class ShippingController {
  constructor(
    @Inject('IShippingService')
    private shippingService: IShippingService,
  ) {}

  @Post('create')
  async createShipping(@Body() shipping: ShippingDto): Promise<ShippingDto> {
    return await this.shippingService.createOne(shipping);
  }

  @Put('update/:id')
  async updateShippingById(
    @Param('id') id: number,
    @Body() shippingDto: ShippingDto,
  ): Promise<ShippingDto> {
    return this.shippingService.updateOneById(id, shippingDto);
  }

  @Delete('delete/:id')
  async deleteShippingById(@Param('id') id: number): Promise<void> {
    console.log(await this.shippingService.deleteOneById(id));
  }

  @Get('get-shippings')
  async getShippings(): Promise<ShippingDto[]> {
    return await this.shippingService.getAll();
  }

  @Get(':id')
  async getShipping(@Param('id') id: number): Promise<ShippingDto> {
    return await this.shippingService.getOneById(id);
  }
}
