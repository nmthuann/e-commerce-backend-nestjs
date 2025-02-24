import { Inject, Injectable } from '@nestjs/common';
import { IOrderService } from '../order/order.service.interface';
import { ProductEntity } from 'src/modules/v1/products/product/product.entity';
import { IProductService } from 'src/modules/v1/products/product/product.service.interface';
import { OrderEntity } from '../order/order.entity';
import Stripe from 'stripe';

import * as dotenv from 'dotenv';
import { ProductError } from 'src/constants/errors.enum';
dotenv.config();

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(
    @Inject('IOrderService')
    private readonly orderService: IOrderService,
    @Inject('IProductService')
    private readonly productService: IProductService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      // apiVersion: '2022-11-15',
      typescript: true,
    });
  }

  /**
   * 1. where: {id: productIds} -> getProductsByProductIds
   * 2. const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
   * 3. const order = await prismadb.order.create({}) -> create Order Online
   * 4. session = await stripe.checkout.sessions.create({line_items,
   *
   * @param productIds
   * @returns  url
   */

  async CheckOut(customer: string, productIds: number[]) {
    // kiểm tra danh sách mã hợp lệ
    const products: ProductEntity[] =
      await this.productService.getProductsByProductIds(productIds);
    if (!products) {
      return { message: ProductError.PRODUCT_ID_NOT_EXIST };
    }

    // kiểm tra số lượng hàng tồn.
    const checkInventory = await this.productService.checkInventoryOrderOnline(
      productIds,
    );
    if (!checkInventory) {
      return { message: ProductError.PRODUCT_INVENTORY_ERROR };
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    products.forEach((product) => {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: 'VND', // VND USD
          product_data: {
            name: product.model_name,
          },
          unit_amount: product.price,
        },
      });
    });

    // const data = {shipping_id, discount_id} //, total_price
    const order: OrderEntity = await this.orderService.createOrderOnline(
      customer,
      productIds,
    );

    const session = await this.stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.order_id, // orderId
      },
    });

    console.log(session.url);
    return session.url;
  }

  async Webhook(req: any) {
    const event = req.body;
    switch (event.type) {
      case 'checkout.session.completed':
        const paymentIntent = event.data.object;

        const address = paymentIntent?.customer_details?.address;
        const addressComponents = [
          address?.line1,
          address?.line2,
          address?.city,
          address?.state,
          address?.postal_code,
          address?.country,
        ];
        const addressString = addressComponents
          .filter((c) => c !== null)
          .join(', ');

        const findOrder: OrderEntity = await this.orderService.getOneById(
          paymentIntent.metadata.orderId,
        );
        console.log('findOrder:::::', findOrder);
        findOrder.delivery_address = addressString;
        findOrder.contact = paymentIntent?.customer_details?.phone || '';
        const update = await this.orderService.updateOneById(
          findOrder.order_id,
          findOrder,
        );
        console.log(update);

        break;
      case 'charge.succeeded':
        break;
      case 'payment_intent.succeeded':
        break;
      case 'payment_intent.created':
        break;
      case 'payment_method.attached':
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    return true;
  }
}