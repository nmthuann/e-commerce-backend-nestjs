import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'
dotenv.config()

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: '1433',
  port: parseInt(process.env.DB_PORT),
  username: 'sa',
  password: '123456',
  database: 'TTTN_DongHoOnline',
  logging: false,
  synchronize: false,
  migrationsRun: false,
  options: {
    trustServerCertificate: true
  },
  extra: {
    charset: 'utf8mb4_unicode_ci'
  }
})
