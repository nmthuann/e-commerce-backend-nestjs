import { Module } from '@nestjs/common';
import { BrandEntity } from '../entities/brand.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrandEntity
    ])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}