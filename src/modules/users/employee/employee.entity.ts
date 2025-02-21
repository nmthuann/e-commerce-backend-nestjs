import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PositionEntity } from '../position/position.entity';
import { UserEntity } from '../user/user.entity';
import { OrderEntity } from 'src/modules/orders/order/order.entity';
import { BaseEntity } from 'src/common/bases/base.entity';

@Entity({ name: 'Employees' })
export class EmployeeEntity extends BaseEntity {
  @PrimaryColumn({  length: 50 })
  employee_id: string; //  cccd

  @Column({ type: 'int', default: 0 })
  salary: number;

  @Column({ default: true })
  work_status: boolean;

  @OneToOne(() => UserEntity, (user) => user.employee) 
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order) => order.employee)
  orders: OrderEntity[];

  @ManyToOne(() => PositionEntity, (position) => position.employees, {
    lazy: true,
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;
}
