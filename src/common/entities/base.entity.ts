import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

// Lớp cha cho entity cần audit thời gian. Không gắn @Entity() vì đây không phải bảng.
// Không dùng soft delete: dữ liệu ngừng dùng được đánh dấu bằng cột trạng thái (status / is_active).
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date
}
