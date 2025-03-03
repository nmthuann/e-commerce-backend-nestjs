import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm'
import { WarrantyEntity } from './warranty.entity'
import { EmployeeEntity } from 'src/modules/users/employee/domain/entities/employee.entity'

@Entity({ name: 'warranty_details' })
export class WarrantyDetailEntity {
  @PrimaryColumn({ name: 'warranty_id', type: 'int' })
  warrantyId: number

  @PrimaryColumn({ name: 'received_at', type: 'timestamp' })
  receivedAt: Date

  @Column({ name: 'returned_at', type: 'timestamp', nullable: true })
  returnedAt?: Date

  @Column({ name: 'before_status', type: 'varchar', length: 255 })
  beforeStatus: string

  @Column({ name: 'after_status', type: 'varchar', length: 255, nullable: true })
  afterStatus?: string

  @ManyToOne(() => WarrantyEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warranty_id' })
  warranty: WarrantyEntity

  @ManyToOne(() => EmployeeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity
}
