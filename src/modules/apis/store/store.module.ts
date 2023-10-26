// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { CategoryEntity } from "src/modules/products/category/category.entity";
// import { CategoryModule } from "src/modules/products/category/category.module";
// import { DiscountEntity } from "src/modules/products/discount/discount.entity";
// import { DiscountModule } from "src/modules/products/discount/discount.module";
// import { ProductEntity } from "src/modules/products/product/entities/product.entity";
// import { ProductStoreController } from "./controllers/product.store.controller";
// import { CategoryStoreController } from "./controllers/category.store.controller";
// import { ProductModule } from "src/modules/products/product/product.module";

// @Module({
//     imports:[
//        TypeOrmModule.forFeature([ProductEntity, CategoryEntity, DiscountEntity]),
//        CategoryModule,
//        DiscountModule,
//        ProductModule
//     ],
//     controllers: [ProductStoreController,
//         CategoryStoreController],
// })
// export class StoreModule {}
