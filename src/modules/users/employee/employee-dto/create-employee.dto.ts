import { IsEmpty } from "class-validator";

export class CreateEmployeeDto {
  
  @IsEmpty()
  employee_id: string; // cccd
  salary: number;
  work_status: boolean;
  position: number
  user: number; 
  // order: OrderDto; 
}