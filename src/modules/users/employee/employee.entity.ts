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
import { BaseEntity } from 'src/modules/bases/base.entity';

@Entity({ name: 'Employees' })
export class EmployeeEntity extends BaseEntity {
  @PrimaryColumn({ type: 'nvarchar', length: 50 })
  employee_id: string; //  cccd

  @Column({ type: 'int', default: 0 })
  salary: number;

  @Column({ default: true })
  work_status: boolean;

  // @OneToOne(() => PositionEntity)
  // @JoinColumn({name: 'position_id'})
  // position: PositionEntity

  @OneToOne(() => UserEntity, (user) => user.employee) // specify inverse side as a second parameter
  user: UserEntity;

  // @OneToOne(() => OrderEntity, (order) => order.employee) // specify inverse side as a second parameter
  // order: OrderEntity

  @OneToMany(() => OrderEntity, (order) => order.employee)
  orders: OrderEntity[];

  @ManyToOne(() => PositionEntity, (position) => position.employees, {
    lazy: true,
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;
}
