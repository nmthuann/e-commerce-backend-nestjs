import { EmployeeDto } from "src/modules/users/employee/employee-dto/employee.dto";
import { PaymentDto } from "../../payment/payment.dto";
import { ShippingDto } from "../../shipping/shipping.dto";
import { UserDto } from "src/modules/users/user/user-dto/user.dto";
import { DiscountDto } from "src/modules/products/discount/discount-dto/discount.dto";

export class OrderDto {
  order_id: number;
  shipping: ShippingDto;
  payment: PaymentDto;
  employee: EmployeeDto;
  user: UserDto;
  discount: DiscountDto;
  total_price: number;
  status: string;
}