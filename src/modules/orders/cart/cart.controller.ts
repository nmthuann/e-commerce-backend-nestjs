import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common'
import { ICartService } from './cart.service.interface'
import { CartDto } from './dtos/cart.dto'
import { CreateCartDto } from './dtos/create-cart.dto'

@Controller('/carts')
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService
  ) {}

  @Get()
  async getCart(@Query('userId') userId: string): Promise<CartDto> {
    return await this.cartService.getCart(userId)
  }

  @Post()
  async createOne(@Body() data: CreateCartDto): Promise<CartDto> {
    const userId = ''
    return await this.cartService.createOne(userId, data)
  }
}
