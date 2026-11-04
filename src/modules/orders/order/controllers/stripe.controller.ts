import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'
import { Roles } from 'src/common/decorators/roles.decorator'
import { Role } from 'src/common/enums/role.enum'
import { CheckoutDto } from '../domain/dtos/checkout.dto'
import { StripeService } from '../services/impl/stripe.service'

// TODO(P5.4): chưa đăng ký vào OrderModule — viết lại luồng Stripe + webhook
@ApiTags('Payments')
@Controller()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Roles(Role.CUSTOMER)
  @Post('/checkout')
  async checkout(@CurrentUser('sub') userId: string, @Body() data: CheckoutDto[]) {
    return await this.stripeService.checkout(userId, data)
  }
}
