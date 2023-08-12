import { Body, Controller, Header, HttpException, HttpStatus, Options, Post,Request, Res} from "@nestjs/common";
import { CheckOutDto } from "./stripe-dto/checkout.dto";
import { StripeService } from "./stripe.service";
import axios from "axios";
import Stripe from "stripe";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// working with DTO
@Controller() 
export class StripeController {
     // private stripe: Stripe;
    constructor(
        private stripeService: StripeService
    ) {
    }
    @Options()
    options() {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: {},
    };
}

    @Post('checkout')
    // @Header('Access-Control-Allow-Origin', '*')
    // @Header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    // @Header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    // @Header('Authorization', `Bearer ${process.env.STRIPE_API_KEY}`)
    async CheckOut(
        
        @Request() req: any, @Res() res: Response){
        // res.status // (HttpStatus.OK).send()
    //      const corsHeaders = {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //     'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    //   };

        const { productIds, shipping_id, discount_id, total_price } = req.body;
                if (!productIds || productIds.length === 0) {
            throw new HttpException('Product ids are required', HttpStatus.BAD_REQUEST);
        }
        const result = await this.stripeService.CheckOut(productIds, shipping_id, discount_id, total_price);

    //     const stripeApiKey = process.env.STRIPE_API_KEY;
    // const stripeResponse = await axios.post('https:/localhost:3001/cart', result, {
    //   headers: {
    //     Authorization: `Bearer ${stripeApiKey}`,
    //     // Other headers if needed
    //   },
    // });
        
        return {
            result,
            headers: corsHeaders,
        }
    }


    @Post('webhook')
    async WebHook(@Request() req: Request, @Res() res: Response){
        return await this.stripeService.WebHook(req, res);
    }



}