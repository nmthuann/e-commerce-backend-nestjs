import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './modules/products/category/category.module';
import { CategoryEntity } from './modules/products/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        type: 'mssql',
        host: 'localhost',
        port: 1433,
        username: 'sa',
        password: '123456',
        database: 'TTTN_DongHoOnline',
        synchronize: true,
        options: {
          trustServerCertificate: true, // Allow self-signed certificates
        },
        entities: [
          CategoryEntity
        ]
      }
    ),

    CategoryModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  
