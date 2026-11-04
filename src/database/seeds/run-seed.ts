import { Logger } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../datasource'

export type Seeder = {
  name: string
  run: (dataSource: DataSource) => Promise<void>
}

// Thêm seeder theo thứ tự phụ thuộc (P2.5: positions, admin; P3: brand/category/product mẫu).
// Mỗi seeder phải idempotent: chạy lại nhiều lần không sinh dữ liệu trùng.
const seeders: Seeder[] = []

async function runSeeds() {
  const logger = new Logger('Seed')
  await AppDataSource.initialize()
  try {
    for (const seeder of seeders) {
      logger.log(`Running ${seeder.name}`)
      await seeder.run(AppDataSource)
    }
    logger.log(`Done (${seeders.length} seeder)`)
  } finally {
    await AppDataSource.destroy()
  }
}

runSeeds().catch(error => {
  new Logger('Seed').error(error)
  process.exit(1)
})
