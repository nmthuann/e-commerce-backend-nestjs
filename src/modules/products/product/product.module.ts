import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryEntity } from '../category/category.entity'
import { BrandEntity } from '../brand/brand.entity'
import { ProductEntity } from './domain/entities/product.entity'
import { ProductSkuEntity } from './domain/entities/product-sku.entity'
import { SpuSkuMappingEntity } from './domain/entities/spu-sku-mapping.entity'
import { ProductService } from './services/impl/product.service'
import { ProductController } from './controllers/product.controller'
import { PriceEntity } from './domain/entities/price.entity'
import { InventoryModule } from 'src/modules/inventories/inventory/inventory.module'
import { ProductSkuService } from './services/impl/product-sku.service'
import { ProductSkuController } from './controllers/product-sku.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      BrandEntity,
      ProductEntity,
      ProductSkuEntity,
      SpuSkuMappingEntity,
      PriceEntity
    ]),
    InventoryModule
  ],
  controllers: [ProductController, ProductSkuController],
  providers: [
    {
      provide: 'IProductService',
      useClass: ProductService
    },
    {
      provide: 'IProductSkuService',
      useClass: ProductSkuService
    }
  ],
  exports: ['IProductService', 'IProductSkuService']
})
export class ProductModule {}
