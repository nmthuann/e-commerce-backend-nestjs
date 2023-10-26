// import { Body, Controller, Inject,  Post, Put, Delete, Get, Param, Query } from "@nestjs/common";
// import { ICategoryService } from "src/modules/products/category/category.service.interface";
// import { ProductEntity } from "src/modules/products/product/entities/product.entity";
// import { ProductFilterDto } from "src/modules/products/product/product-dto/product-filter.dto";
// import { IProductService } from "src/modules/products/product/product.service.interface";

// // working with DTO
// @Controller('category')
// export class CategoryStoreController {

//     constructor(
//         @Inject('IProductService')
//         private productService: IProductService,
//         @Inject('ICategoryService')
//         private categorytService: ICategoryService
//     ) {}

//     @Get(':category_id/?')  //  http://localhost:3000/category/:category_id/?brand=Hublot
//     async getProductsByCategoryId(
//         @Param("category_id") category_id: number,
//         @Query('brand') brand: string
//     ): Promise<ProductEntity[]> {
//         console.log("Ủa alo")
//         return await this.productService.getProductsByBrand(category_id, brand);
//     }
// }
