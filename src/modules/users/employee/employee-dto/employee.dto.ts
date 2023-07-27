import { OrderDto } from "src/modules/orders/order/order-dto/order.dto";
import { UserDto } from "../../user/user-dto/user.dto";
import { PositionDto } from "../../position/position.dto";

export class EmployeeDto {
  employee_id: string; // cccd
  salary: number;
  work_status: boolean;
  position: PositionDto; 
  user: UserDto; 
  order: OrderDto; 
}