import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export const AppDataSource = new DataSource ({ //
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/!(*base).entity.js'], ///**/!(*base).entity.js
  migrations: ['dist/**/migrations/*.js'], // //__dirname + '/**/migrations/*.js'
  logging: false,
  synchronize: false,
  migrationsRun: false,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
})