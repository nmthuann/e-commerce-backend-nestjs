import { EmployeeDto } from 'src/modules/v1/modules/users/employee/employee-dto/employee.dto'
import { ShippingDto } from '../../shipping/shipping.dto'
import { DiscountDto } from 'src/modules/v1/products/discount/discount-dto/discount.dto'
import { PaymentDto } from '../../payment/payment.dto'
import { UserDto } from 'src/modules/v1/modules/users/user/user-dto/user.dto'

export class OrderDto {
  order_id: number
  total_price: number
  status: string

  //  5 FK: Shippings- Payment - Employee - User - Employee
  shipping: ShippingDto
  payment: PaymentDto
  employee: EmployeeDto
  user: UserDto
  discount: DiscountDto
}

export interface RevenueByMonth {
  month: string
  total: number
}
