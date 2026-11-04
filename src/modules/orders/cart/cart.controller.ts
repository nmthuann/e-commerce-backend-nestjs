import { Body, Controller, Get, Inject, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { ICartService } from './cart.service.interface'
import { CartDto } from './dtos/cart.dto'
import { CreateCartDto } from './dtos/create-cart.dto'

@ApiTags('Carts')
@Roles(Role.CUSTOMER)
@Controller('/carts')
export class CartController {
  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService
  ) {}

  @Get()
  async getCart(@CurrentUser('sub') userId: string): Promise<CartDto> {
    return await this.cartService.getCart(userId)
  }

  @Post()
  async createOne(@CurrentUser('sub') userId: string, @Body() data: CreateCartDto): Promise<CartDto> {
    return await this.cartService.createOne(userId, data)
  }
}
