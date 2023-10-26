import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryEntity } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { DiscountEntity } from '../discount/discount.entity';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, CategoryEntity, DiscountEntity]),
    CategoryModule,
    DiscountModule,
  ],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
  ],
  exports: ['IProductService'],
})
export class ProductModule {}
