import { Module } from '@nestjs/common'
import { ProductModule } from './product/product.module'
import { BrandModule } from './brand/brand.module'
import { CategoryModule } from './category/category.module'

@Module({
  imports: [ProductModule, BrandModule, CategoryModule]
})
export class ProductsModule {}
