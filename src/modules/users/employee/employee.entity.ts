import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { PositionEntity } from "../position/position.entity";
import { UserEntity } from "../user/user.entity";
import { OrderEntity } from "src/modules/orders/order/order.entity";

@Entity({name:  'Employees'})
export class EmployeeEntity extends BaseEntity {
  @PrimaryColumn()
  employee_id: string; //  cccd

  @Column({default: 0})
  salary: number;

  @Column({default: true})
  work_status: boolean;

  @OneToOne(() => PositionEntity)
  @JoinColumn({name: 'position_id'})
  position: PositionEntity

  @OneToOne(() => UserEntity, (user) => user.employee) // specify inverse side as a second parameter
  user: UserEntity

  @OneToOne(() => OrderEntity, (order) => order.employee) // specify inverse side as a second parameter
  order: OrderEntity
}