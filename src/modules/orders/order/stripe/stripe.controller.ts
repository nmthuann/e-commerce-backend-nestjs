// import { Body, Controller, Header, HttpException, HttpStatus, Options, Post,Request, Res, UseInterceptors} from "@nestjs/common";
// import { CheckOutDto } from "./stripe-dto/checkout.dto";
// // import { StripeService } from "./stripe.service";
// import axios from "axios";
// import Stripe from "stripe";
// import { CorsInterceptor } from "src/common/interceptors/checkout.interceptor";
// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };

// // working with DTO
// @Controller() 

// export class StripeController {
//      // private stripe: Stripe;
//     constructor(
//         private stripeService: StripeService
//     ) {
//     }
// //     @Options()
// //     options() {
// //     return {
// //       statusCode: 200,
// //       headers: corsHeaders,
// //       body: {},
// //     };
// // }

//     @Post('checkout')
//     async CheckOut(
        
//         @Request() req: any, @Res() res: Response){

//         const { productIds, shipping_id, discount_id} = req.body; //, total_price 
//                 if (!productIds || productIds.length === 0) {
//             throw new HttpException('Product ids are required', HttpStatus.BAD_REQUEST);
//         }
//         const result = await this.stripeService.CheckOut(productIds, shipping_id, discount_id); //, total_price
        
//         console.log(result)
//         return result
        
//     }


//     @Post('webhook')
//     async WebHook(@Request() req: Request, @Res() res: Response){
//         return await this.stripeService.WebHook(req, res);
//     }



// }