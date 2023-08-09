import { EmployeeDto } from "src/modules/users/employee/employee-dto/employee.dto";
import { PaymentDto } from "../../payment/payment.dto";
import { ShippingDto } from "../../shipping/shipping.dto";
import { UserDto } from "src/modules/users/user/user-dto/user.dto";
import { DiscountDto } from "src/modules/products/discount/discount-dto/discount.dto";

export class OrderDto {
  order_id: number;
  total_price: number;
  status: string;

  //  5 FK: Shippings- Payment - Employee - User - Employee
  shipping: ShippingDto;
  payment: PaymentDto;
  employee: EmployeeDto;
  user: UserDto;
  discount: DiscountDto;
}


export interface RevenueByMonth{
  month: string,
  total: number
}