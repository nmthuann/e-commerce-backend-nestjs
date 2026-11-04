import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminProductController } from './controllers/admin-product.controller';
import { BrandController } from './controllers/brand.controller';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { BrandEntity } from './entities/brand.entity';
import { CategoryEntity } from './entities/category.entity';
import { PriceEntity } from './entities/price.entity';
import { ProductSkuEntity } from './entities/product-sku.entity';
import { ProductEntity } from './entities/product.entity';
import { SpuSkuMappingEntity } from './entities/spu-sku-mapping.entity';
import { BrandService } from './services/brand.service';
import { CategoryService } from './services/category.service';
import { PriceService } from './services/price.service';
import { ProductSkuService } from './services/product-sku.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BrandEntity,
      CategoryEntity,
      ProductEntity,
      ProductSkuEntity,
      SpuSkuMappingEntity,
      PriceEntity,
    ]),
  ],
  controllers: [
    BrandController,
    CategoryController,
    ProductController,
    AdminProductController,
  ],
  providers: [
    BrandService,
    CategoryService,
    ProductService,
    ProductSkuService,
    PriceService,
  ],
  // Module đơn hàng (P5) dùng giá hiện hành + tồn kho khi đặt hàng
  exports: [ProductSkuService, PriceService],
})
export class ProductsModule {}
