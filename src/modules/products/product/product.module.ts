import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../category/category.entity';
import { BrandEntity } from '../brand/brand.entity';
import { ProductEntity } from './domain/entities/product.entity';
import { ProductSkuEntity } from './domain/entities/product-sku.entity';
import { SpuSkuMappingEntity } from './domain/entities/spu-sku-mapping.entity';
import { ProductService } from './services/impl/product.service';
import { ProductController } from './controllers/product.controller';
import { PriceEntity } from '../pricing/price.entity';

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
