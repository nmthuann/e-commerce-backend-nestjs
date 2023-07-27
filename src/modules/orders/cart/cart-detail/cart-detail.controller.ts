import { Body, Controller, Delete, Get, Param, Post, Put, Inject, UseGuards } from '@nestjs/common';
import { CartDetailDto } from '../cart-dto/cart-detail.dto';
import { ICartDetailService } from '../cart-detail/cart-detail.service.interface';


// working with DTO
@Controller('CartDetail') 
export class CartDetailController {
    
    constructor(@Inject('ICartDetailService')
        private cartDetailService: ICartDetailService
    ) {}

    @Post('create')
    async createCartDetail(@Body() cartDetail: CartDetailDto): Promise<CartDetailDto> {
        return await this.cartDetailService.createOne(cartDetail);
    }


    @Put('update/:id')
    async updateCartDetailById(@Param('id') id: number, @Body() cartDetailDto: CartDetailDto): Promise<CartDetailDto> {
        return this.cartDetailService.updateOneById(id, cartDetailDto);
    }


    @Delete('delete/:id')
    async deleteCartDetailById(@Param('id') id: number): Promise<void> {
        console.log(await this.cartDetailService.deleteOneById(id));
    }

    
    @Get('get-CartDetail')
    async getCartDetails(): Promise<CartDetailDto[]> {
        return await this.cartDetailService.getAll();
    }


    @Get(':id')
    async getCartDetail(@Param('id') id: number): Promise<CartDetailDto> {
        return await this.cartDetailService.getOneById(id);
    }
}