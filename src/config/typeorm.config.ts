import { ConfigService } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { EnvironmentVariables } from './env.validation'

export const typeOrmConfigFactory = (config: ConfigService<EnvironmentVariables, true>): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', { infer: true }),
  port: config.get('DB_PORT', { infer: true }),
  username: config.get('DB_USERNAME', { infer: true }),
  password: config.get('DB_PASSWORD', { infer: true }),
  database: config.get('DB_DATABASE', { infer: true }),
  logging: config.get('DB_LOGGING', { infer: true }),
  // Entity được đăng ký qua TypeOrmModule.forFeature() ở từng module
  autoLoadEntities: true,
  // Schema chỉ thay đổi qua migration (src/database/migrations)
  synchronize: false,
  migrationsRun: false
})
