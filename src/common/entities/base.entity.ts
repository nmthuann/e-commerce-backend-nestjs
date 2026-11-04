import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

// Lớp cha cho entity cần audit thời gian + soft delete. Không gắn @Entity() vì đây không phải bảng.
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date
}
