import { Body, Controller, Headers, Post, Request, UseGuards } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { UserRoleGuard } from '../../../guards/user.role.guard'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

// working with DTO
@Controller()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @UseGuards(UserRoleGuard)
  @Post('/v1/checkout')
  async CheckOut(@Request() req: any, @Body() productIds: any, res: Response) {
    const customer = req['email']
    const result = await this.stripeService.CheckOut(customer, productIds)
    return result
  }

  @Post('/v1/webhook')
  async handleWebhook(@Request() req: any, @Headers('Stripe-Signature') signature: string) {
    const result = await this.stripeService.Webhook(req)
    return result
  }
}
