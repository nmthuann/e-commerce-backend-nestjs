import { OrderDto } from "src/modules/orders/order/order-dto/order.dto";
import { AccountDto } from "../../account/account-dto/account.dto";
import { EmployeeDto } from "../../employee/employee-dto/employee.dto";

export class UserDto {
  user_id: number;
  first_name: string;
  last_name: string;
  avatar_url:string;
  gender: string;
  birthday: Date;
  address: string;
  phone: string;
  account: AccountDto; 
  employee: EmployeeDto; 
  order: OrderDto; 
}