// import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
// import { IOrderService } from "../order.service.interface";

// import { ProductEntity } from "src/modules/products/product/entities/product.entity";
// import { IProductService } from "src/modules/products/product/product.service.interface";
// import { OrderEntity } from "../order.entity";
// import Stripe from "stripe";
// // import { Stripe } from "stripe";

// // import { Request } from 'express';
// // process.env.STRIPE_API_KEY
// @Injectable()
// export class StripeService{
//     private stripe: Stripe;
//     constructor(
//         @Inject('IOrderService')
//         private orderService: IOrderService,
//         @Inject('IProductService')
//         private productService: IProductService
//     ){
//         this.stripe = new Stripe('sk_test_51NeC3ZBBqaLqmxuRZsEaNwZSOg3OSdckLaL8v5irEqGRAll9gNex4KAJmbO8qBpEHvpqDYt64Q8QPsMxKcvPNWlb00DshqLtwy', {
//             apiVersion: '2022-11-15',
//             typescript: true,
//         });
//     }


//     async CheckOut(productIds: number[], shipping_id: string, discount_id: number){ //, total_price: number
//             // // check product  
//             // const GET_PRODUCTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/product/get-product-by-ids`
//         const products: ProductEntity[]  = 
//             await this.productService.getProductsByProductIds(productIds);

//         const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

//             products.forEach((product) => {
//                 line_items.push({
//                 quantity: 1,
//                 price_data: {
//                     currency: 'USD',
//                     product_data: {
//                     name: product.product_name,
//                     },
//                     unit_amount: product.price * 100
//                 }
//             });
//         });



        
//         const data = {shipping_id, discount_id} //, total_price

//         const order: OrderEntity = await this.orderService.createNewOrderOnline(data, productIds)

//         const session = await this.stripe.checkout.sessions.create({
//             line_items,
//             mode: 'payment',
//             billing_address_collection: 'required',
//             phone_number_collection: {
//             enabled: true,
//             },
//             success_url: `http://localhost:3001/cart?success=1`,
//             cancel_url: `http://localhost:3001/cart?canceled=1`,
//             metadata: {
//             orderId: order.order_id
//             },
//             // discounts: [
//             //     {
//             //         coupon: String(discount_id), // Thay thế YOUR_COUPON_CODE bằng mã giảm giá thực tế
//             //     },
//             // ],
//         });

//         console.log(session.url)
//         return session.url
//     }




//     async WebHook(req: Request, res: Response){
//         const body = await req.text()
//         const signature = req.headers.get("Stripe-Signature") as string

//         let event: Stripe.Event

//         try {
//             event = this.stripe.webhooks.constructEvent(
//             body,
//             signature,
//             process.env.STRIPE_WEBHOOK_SECRET!
//             )
//         } catch (error: any) {
//             // return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
//             throw new HttpException('Product ids are required', HttpStatus.BAD_REQUEST);
//         }

//         const session = event.data.object as Stripe.Checkout.Session;
//         const address = session?.customer_details?.address;

//         const addressComponents = [
//             address?.line1,
//             address?.line2,
//             address?.city,
//             address?.state,
//             address?.postal_code,
//             address?.country
//         ];

//         const addressString = addressComponents.filter((c) => c !== null).join(', ');


//         if (event.type === "checkout.session.completed") {



//             const UPDATE_ORDER_URL =  `${process.env.NEXT_PUBLIC_API_URL}/order/update-order-online`
//             const data = {
//                 delivery_address: addressString,
//                 contact: session?.customer_details?.phone || '',
//             }


//             const findOrder: OrderEntity = await this.orderService.getOneById(session.metadata.orderId) 
//             findOrder.delivery_address = data.delivery_address;
//             findOrder.contact = data.contact;
//             // await axios.post(UPDATE_ORDER_URL, data);
//             const update = await this.orderService.updateOneById(findOrder.order_id, findOrder)
//             console.log(update)
//         }

//         return;
//         // res.status().send(null);
//         //   return (req: Request, res: Response): void => {
//         //     res.status(404).send('Not Found');
//         // };

        
//     }


    
// }