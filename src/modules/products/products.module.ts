import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './category/category.entity';
import { BrandEntity } from './brand/brand.entity';
import { ProductEntity } from './product/domain/entities/product.entity';
import { ProductSkuEntity } from './product/domain/entities/product-sku.entity';
import { SpuSkuMappingEntity } from './product/domain/entities/spu-sku-mapping.entity';
import { ProductsController } from './product/controllers/products.controller';
import { PriceEntity } from './pricing/price.entity';
import { ProductsService } from './product/services/impl/products.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity, 
      BrandEntity, 
      ProductEntity,
      ProductSkuEntity,
      SpuSkuMappingEntity,
      PriceEntity
    ])],
  providers: [ProductsService],
  controllers: [ProductsController],
})
export class ProductsModule {}
