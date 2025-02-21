import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PositionEntity } from './position.entity';
import { UserEntity } from './user.entity';

@Entity({name:'employees'})
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'double precision' })
  salary: number;

  @Column({ type: 'boolean' })
  work_status: boolean;

  @ManyToOne(() => PositionEntity, { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' })
  position: PositionEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  work_start_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;
}
