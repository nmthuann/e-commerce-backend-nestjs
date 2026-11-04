import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'
import { Position } from 'src/common/enums/role.enum'

@Entity({ name: 'positions' })
export class PositionEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  // Mã vị trí gắn với quyền (RolesGuard / @Positions) nên chỉ nhận giá trị trong enum Position
  @Column({ type: 'varchar', length: 30, unique: true })
  code: Position

  @Column({ type: 'varchar', length: 100 })
  name: string

  @Column({ type: 'text', nullable: true })
  description?: string
}
