import { Body, Controller, Get, Inject, Post, Request, UseGuards } from '@nestjs/common'
import { ICartService } from './cart.service.interface'
import { CartDto } from './dtos/cart.dto'
import { CreateCartDto } from './dtos/create-cart.dto'
import { UserRoleGuard } from 'src/guards/user-role.guard'
import { UserRequest } from 'src/modules/users/domain/dtos/request/user.request'

@Controller('/carts')
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService
  ) {}

  @Get()
  @UseGuards(UserRoleGuard)
  async getCart(@Request() req: UserRequest): Promise<CartDto> {
    return await this.cartService.getCart(req.userId)
  }

  @Post()
  async createOne(@Body() data: CreateCartDto): Promise<CartDto> {
    const userId = ''
    return await this.cartService.createOne(userId, data)
  }
}
