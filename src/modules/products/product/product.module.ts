import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";

@Module({
    imports:[
       TypeOrmModule.forFeature([ProductEntity])
    ],
    controllers: [ProductController],
    providers: [
        {
            provide: 'IProductService',
            useClass: ProductService,
        },
    ],
    exports: ['IProductService',]
})
export class ProductModule {}