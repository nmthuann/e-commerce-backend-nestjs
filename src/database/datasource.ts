import { config } from 'dotenv'
import { join } from 'path'
import { DataSource } from 'typeorm'

// File này chỉ dùng cho TypeORM CLI (migration) và seed — app dùng ConfigModule (src/config/typeorm.config.ts)
config({ quiet: true })

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // Chạy được cả khi ở src (ts-node) lẫn dist (node)
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  logging: process.env.DB_LOGGING === 'true',
  synchronize: false,
  migrationsRun: false
})
