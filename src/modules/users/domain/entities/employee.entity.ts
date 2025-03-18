import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm'
import { PositionEntity } from './position.entity'
import { UserEntity } from './user.entity'
import { InvoiceEntity } from 'src/modules/orders/order/domain/entities/invoice.entity'

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => UserEntity, user => user.employee, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity

  @Column({ type: 'double precision' })
  salary: number

  @Column({ name: 'work_status', type: 'boolean' })
  workStatus: boolean

  @ManyToOne(() => PositionEntity, { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'position_id' })
  position: PositionEntity

  @Column({ name: 'work_start_date', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  workStartDate: Date

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string

  @OneToMany(() => InvoiceEntity, invoice => invoice.order)
  invoices: InvoiceEntity[]
}
