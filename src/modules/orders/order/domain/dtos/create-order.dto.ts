export class CreateOrderDto {
  orderType: boolean
  shippingAddress: string
  contactPhone: string
  shippingMethod: string
  paymentMethod: string
  note: string
  shippingFee: number
  discount: number
  postcode?: string
}
