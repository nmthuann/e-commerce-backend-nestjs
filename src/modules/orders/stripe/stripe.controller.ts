import {
  Body,
  Controller,
  Headers,

  Post,
  Request,
  UseGuards,

} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { UserRoleGuard } from 'src/common/guards/user.role.guard';
// import Stripe from 'stripe';
// // import { Request, NextFunction, Response } from "express";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// working with DTO
@Controller()
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @UseGuards(UserRoleGuard)
  @Post('checkout')
  async CheckOut(@Request() req: any, @Body() productIds: any, res: Response) {
    const customer = req['email'];
    const result = await this.stripeService.CheckOut(customer, productIds);
    return result;
  }

  @Post('webhook')
  async handleWebhook(
    @Request() req: any,
    @Headers('Stripe-Signature') signature: string,
  ) {
    const body = req.body;

    // console.log("body",body);
    // const payloadString = JSON.stringify(body, null, 2);
    // // data.object
    // console.log("payloadString",payloadString);payloadString, signature
    // return 0;
    const result = await this.stripeService.Webhook(req);
    return result;
  }
}

//  @Post('stripe')
//     async handleStripeWebhook(
//         @Headers('stripe-signature') signature: string,
//         @Body() eventPayload: any
//     ) {
//         try {
//             const verifiedEvent = this.stripeService.verifyWebhookSignature(
//                 eventPayload,
//                 signature
//             );

//             // Handle the Stripe webhook event (e.g., save data, process payment, etc.)
//             await this.stripeService.handleWebhookEvent(verifiedEvent);

//             return { received: true };
//         } catch (error) {
//             // Handle the signature verification error or other errors
//             throw new HttpException('Webhook signature verification failed', HttpStatus.BAD_REQUEST);
//         }
//     }
