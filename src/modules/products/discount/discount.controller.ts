import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Inject,
} from '@nestjs/common';
import { DiscountDto } from './discount-dto/discount.dto';
import { IDiscountService } from './discount.service.interface';
import { DiscountEntity } from './discount.entity';

// working with DTO
@Controller('discount')
export class DiscountController {
  constructor(
    @Inject('IDiscountService')
    private readonly discountService: IDiscountService,
  ) {}

  @Post('create')
  async createDiscount(@Body() discount: DiscountDto): Promise<DiscountEntity> {
    return await this.discountService.createOne(discount);
  }

  @Put('update/:id')
  async updateDiscountById(
    @Param('id') id: number,
    @Body() discountDto: DiscountDto,
  ): Promise<DiscountDto> {
    return this.discountService.updateOneById(id, discountDto);
  }


  @Get('get-discounts')
  async getDiscounts(): Promise<DiscountDto[]> {
    return await this.discountService.getAll();
  }

  @Post()
  async CheckShipping(
    @Body() @Body() requestBody: { discountCode: string },
  ): Promise<DiscountDto> {

    const result = await this.discountService.getOneById(
      parseInt(requestBody.discountCode),
    );
    console.log('adsdasdasdad', result);
    return result;
  }

  @Get(':discount_id')
  async getDiscount(@Param('discount_id') id: number): Promise<DiscountDto> {
    return await this.discountService.getOneById(id);
  }
}
