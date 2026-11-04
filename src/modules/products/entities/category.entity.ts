import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from 'src/common/entities/base.entity'

@Entity({ name: 'categories' })
export class CategoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string

  @Column({ type: 'varchar', length: 120, unique: true })
  slug: string

  @Column({ type: 'text', nullable: true })
  description?: string
}
