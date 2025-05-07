import { Controller, Logger, Post, UseGuards, Request, Body } from '@nestjs/common'
import { UserRoleGuard } from 'src/guards/user-role.guard'
import { UserRequest } from 'src/modules/users/domain/dtos/request/user.request'
import { CheckoutDto } from '../domain/dtos/checkout.dto'
import { StripeService } from '../services/impl/stripe.service'

@Controller()
export class StripeController {
  private readonly logger = new Logger(StripeController.name)

  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(UserRoleGuard)
  @Post('/checkout')
  async CheckOut(@Request() req: UserRequest, @Body() data: CheckoutDto[]) {
    const userId = req['userId']
    const result = await this.stripeService.checkout(userId, data)
    return result
  }
}
