import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './image.entity';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { ProductModule } from '../product/backup/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity]), ProductModule],
  controllers: [ImageController],
  providers: [
    {
      provide: 'IImageService',
      useClass: ImageService,
    },
  ],
  exports: ['IImageService'],
})
export class ImageModule {}
