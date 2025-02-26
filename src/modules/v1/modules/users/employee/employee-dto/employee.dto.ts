import { IsEmpty } from 'class-validator';

export class EmployeeDto {
  @IsEmpty()
  employee_id: string; // cccd
  salary: number;
  work_status: boolean;
  position_id: number;
}

