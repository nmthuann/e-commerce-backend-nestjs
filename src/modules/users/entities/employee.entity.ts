import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { decimalTransformer } from 'src/common/utils/decimal.transformer';
import { UserEntity } from './user.entity';
import { PositionEntity } from './position.entity';

@Entity({ name: 'employees' })
export class EmployeeEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, (user) => user.employee, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PositionEntity, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  salary: number;

  @Column({ name: 'hired_at', type: 'date', default: () => 'CURRENT_DATE' })
  hiredAt: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
