// import { Body, Controller, Inject,  Post, Put, Delete, Get, Param, Query } from "@nestjs/common";
// import { ICategoryService } from "src/modules/products/category/category.service.interface";
// import { ProductEntity } from "src/modules/products/product/entities/product.entity";
// import { ProductFilterDto } from "src/modules/products/product/product-dto/product-filter.dto";
// import { IProductService } from "src/modules/products/product/product.service.interface";


// // working with DTO
// @Controller('product') 
// export class ProductStoreController {
    
//     constructor(
//         @Inject('IProductService')
//         private productService: IProductService,
//         // @Inject('ICategoryService')
//         // private categorytService: ICategoryService
//     ) {}

    
//     @Get('get-products/category?')
//     async getProductsByCategoryId(
//         @Query('category_id') category_id: number
//     ): Promise<ProductEntity[]> {   
//         return await this.productService.getProductsByCategoryId(category_id);
//     }


//     @Get('get-products/price?')
//     async getProductsByPriceRange(
//         @Query('category_id') category_id: number,
//         @Query('price') price: number
//     ): Promise<ProductEntity[]> {   
//         console.log(category_id, price)
//         return await this.productService.getProductsByPriceRange(category_id, price);
//     }


//     @Get('get-products/brand?')
//     async getProductsByBrand(
//         @Query('category_id') category_id: number,
//         @Query('brand') brand: string
//     ): Promise<ProductEntity[]> {   
//         console.log(category_id, brand)
//         return await this.productService.getProductsByBrand(category_id, brand);
//     }

    
//     @Get('get-products/:category_id/?')
//     async getProductsByFilter(
//         @Query() filter: ProductFilterDto,
//         @Param("category_id") category_id: number    
//     ): Promise<ProductEntity[]> {   
//         console.log("hahahaha")
//         return this.productService.getProductsByFilter(category_id, filter);
//     }


//     @Get('get-products')
//     async getProducts(): Promise<ProductEntity[]> {
//         return await this.productService.getAll();  
//     }

//     @Get('get-products/brand/:category_id')
//     async getProductBrandsByCategoryId(
//         @Param('category_id') category_id: number
//     ): Promise<string[]> {
//         return await this.productService.getProductBrandByCategoryId(category_id);  
//     }
// }