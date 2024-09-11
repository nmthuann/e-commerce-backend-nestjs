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
import { CartDto } from '../cart/cart-dto/cart.dto';
import { ICartService } from './cart.service.interface';


@Controller('cart')
export class CartController {
  constructor(
    @Inject('ICartService')
    private cartService: ICartService,
  ) {}

  @Post('create')
  async createCart(@Body() cart: CartDto): Promise<CartDto> {
    return await this.cartService.createOne(cart);
  }

  @Put('update/:id')
  async updateCartById(
    @Param('id') id: number,
    @Body() cartDto: CartDto,
  ): Promise<CartDto> {
    return this.cartService.updateOneById(id, cartDto);
  }

  @Delete('delete/:id')
  async deleteCartById(@Param('id') id: number): Promise<void> {
    console.log(await this.cartService.deleteOneById(id));
  }

  @Get('get-cart')
  async getCarts(): Promise<CartDto[]> {
    return await this.cartService.getAll();
  }

  @Get(':id')
  async getCart(@Param('id') id: number): Promise<CartDto> {
    return await this.cartService.getOneById(id);
  }
}
