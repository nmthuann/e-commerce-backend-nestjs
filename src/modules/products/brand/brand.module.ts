import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandEntity } from './brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity])],
  controllers: [BrandController],
  providers: [
    {
      provide: 'IBrandService',
      useClass: BrandService,
    },
  ],
  exports: ['IBrandService'],
})
export class BrandModule {}
