import { Inject, Injectable, Logger } from '@nestjs/common'
import Stripe from 'stripe'

import { IProductSerialService } from 'src/modules/inventories/inventory/services/product-serial.service.interface'
import { ProductSerialResponse } from 'src/modules/inventories/inventory/domain/dtos/product-serial.response'
import { IProductSkuService } from 'src/modules/products/product/services/product-sku.service.interface'
import { IStripeService } from '../stripe.service.interface'
import { ICartService } from 'src/modules/orders/cart/cart.service.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { OrderEntity } from '../../domain/entities/order.entity'
import { Repository } from 'typeorm'
import { CheckoutDto } from '../../domain/dtos/checkout.dto'

@Injectable()
export class StripeService implements IStripeService {
  private readonly stripe: Stripe
  private readonly logger = new Logger(StripeService.name)

  constructor(
    @Inject('ICartService')
    private readonly cartService: ICartService, // order
    @Inject('IProductSerialService')
    private readonly productSerialService: IProductSerialService, // inventory
    @Inject('IProductSkuService')
    private readonly productSkuService: IProductSkuService, // product
    @Inject('STRIPE_API_KEY')
    private readonly apiKey: string,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2025-02-24.acacia',
      typescript: true
    })
    this.logger.log('StripeService initialized with API version 2025-02-24.acacia')
  }
  webhook(req: unknown): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getProducts(): Promise<Stripe.Product[]> {
    try {
      const products = await this.stripe.products.list()
      this.logger.log('Products fetched successfully')
      return products.data
    } catch (error) {
      this.logger.error('Failed to fetch products from Stripe', error.stack)
      throw new Error('Unable to fetch products from Stripe')
    }
  }

  async getCustomers(): Promise<Stripe.Customer[]> {
    try {
      const customers = await this.stripe.customers.list()
      this.logger.log('Customers fetched successfully')
      return customers.data
    } catch (error) {
      this.logger.error('Failed to fetch customers from Stripe', error.stack)
      throw new Error('Unable to fetch customers from Stripe')
    }
  }

  async checkout(
    userId: string,
    data: CheckoutDto[]
  ): Promise<{
    message: string
    url: string
  }> {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
    // kiểm tra số lượng hàng tồn.
    for (const item of data) {
      const serials: ProductSerialResponse[] = await this.productSerialService.getProductSerialsBySkuId(
        item.productSkuId
      )

      const price = await this.productSkuService.getCurrentPriceById(item.productSkuId)

      if (serials.length < item.quantity) {
        throw new Error('Not enough product serials')
      }

      serials.forEach(serial => {
        line_items.push({
          quantity: serials.length,
          price_data: {
            currency: 'VND',
            product_data: {
              name: serial.sku.skuName
            },
            unit_amount: price.sellingPrice
          }
        })
      })

      // xóa cart -> Attention: transaction
      await this.cartService.deleteAllByUserId(userId)
    }

    // create order với một vài field mặc định
    const order = await this.orderRepository.insert({})

    const session = await this.stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      billing_address_collection: 'required',

      phone_number_collection: {
        enabled: true
      },
      success_url: `${process.env.PUBLIC_API_FRONTEND_URL}/cart?success=1`,
      cancel_url: `${process.env.PUBLIC_API_FRONTEND_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.raw[0].order_id
      }
    })

    console.log(session.url)
    return {
      message: 'Checkout successful',
      url: session.url
    }
  }
}
