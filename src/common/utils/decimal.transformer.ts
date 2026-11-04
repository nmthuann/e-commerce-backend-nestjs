import { ValueTransformer } from 'typeorm'

// Postgres trả cột numeric về dạng string; chuyển về number khi đọc
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) => (value === null || value === undefined ? value : Number(value))
}
