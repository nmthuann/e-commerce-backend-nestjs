import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { DiscountDto } from './discount-dto/discount.dto';
import { IDiscountService } from './discount.service.interface';


// working with DTO
@Controller('discount') 
export class DiscountController {
    
    constructor(@Inject('IDiscountService')
        private discountService: IDiscountService
    ) {}

    @Post('create')
    async createDiscount(@Body() discount: DiscountDto): Promise<DiscountDto> {
        return await this.discountService.createOne(discount);
    }


    @Put('update/:id')
    async updateDiscountById(@Param('id') id: number, @Body() discountDto: DiscountDto): Promise<DiscountDto> {
        return this.discountService.updateOneById(id, discountDto);
    }


    @Delete('delete/:id')
    async deleteDiscountById(@Param('id') id: number): Promise<void> {
        console.log(await this.discountService.deleteOneById(id));
    }

    
    @Get('get-discount')
    async getDiscounts(): Promise<DiscountDto[]> {
        return await this.discountService.getAll();
    }


    @Get(':id')
    async getDiscount(@Param('id') id: number): Promise<DiscountDto> {
        return await this.discountService.getOneById(id);
    }
}