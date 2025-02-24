import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { BrandEntity } from './entities/brand.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductSkuEntity } from './entities/product-sku.entity';
import { SpuSkuMappingEntity } from './entities/spu-sku-mapping.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PriceEntity } from './entities/price.entity';

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
