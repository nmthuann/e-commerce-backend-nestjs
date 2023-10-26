import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EmployeeEntity } from '../employee/employee.entity';

@Entity({ name: 'Positions' })
export class PositionEntity {
  @PrimaryGeneratedColumn()
  position_id: number;

  @Column({ type: 'nvarchar', length: 100, nullable: false })
  position_name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 1,
  })
  offer: number;

  @OneToMany(() => EmployeeEntity, (employee) => employee.position)
  employees: EmployeeEntity[];
}
