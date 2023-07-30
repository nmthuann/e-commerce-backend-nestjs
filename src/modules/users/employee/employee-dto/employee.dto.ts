import { OrderDto } from "src/modules/orders/order/order-dto/order.dto";
import { UserDto } from "../../user/user-dto/user.dto";
import { PositionDto } from "../../position/position.dto";
import { IsEmpty } from "class-validator";

export class EmployeeDto {
  
  @IsEmpty()
  employee_id: string; // cccd
  salary: number;
  work_status: boolean;
  // position: PositionDto; 
  // user: UserDto; 

  position: number; 
  user: number; 
  // order: OrderDto; 
}