import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductService } from './product.service';
import { CategoryEntity } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { DiscountEntity } from '../discount/discount.entity';
import { DiscountModule } from '../discount/discount.module';
import { ProductController } from './product.controller';

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
