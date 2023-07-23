import { BaseEntity, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:  'Employees'})
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  employee_id: number;

  
}