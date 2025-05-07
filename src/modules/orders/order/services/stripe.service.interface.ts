import Stripe from 'stripe'
import { CheckoutDto } from '../domain/dtos/checkout.dto'

export interface IStripeService {
  getProducts(): Promise<Stripe.Product[]>
  getCustomers(): Promise<Stripe.Customer[]>
  checkout(userId: string, data: CheckoutDto[]): Promise<{ message: string; url: string }>
  webhook(req: unknown): Promise<void>
}
