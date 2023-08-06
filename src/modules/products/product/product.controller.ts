import { Body, Controller, Inject,  Post, Put, Delete, Get, Param, Query } from "@nestjs/common";
import { IProductService } from "./product.service.interface";
import { ProductDto } from "./product-dto/product.dto";
import { ProductEntity } from "./entities/product.entity";
import { plainToClass } from "class-transformer";
import { ProductFilterDto } from "./product-dto/product-filter.dto";
import { GetProductForOrderDto } from "./product-dto/get-product-order.dto";

// working with DTO
@Controller('product') 
export class ProductController {
    
    constructor(@Inject('IProductService')
        private productService: IProductService
    ) {}

    @Post('create')
    async createProduct(@Body() product: ProductDto): Promise<ProductDto> {
        const createProduct = await this.productService.createOne(product);
        return plainToClass(ProductDto, createProduct)
    }


    @Put('update/:id')
    async updateProductById(@Param('id') id: number, @Body() productDto: ProductDto): Promise<ProductDto> {
        return this.productService.updateOneById(id, productDto);
    }


    @Delete('delete/:id')
    async deleteProductById(@Param('id') id: number): Promise<void> {
        console.log(await this.productService.deleteOneById(id));
    }

    
    // @Get('get-products')
    // async getProducts(): Promise<Partial<ProductEntity>[]> {
    //     return await this.productService.getSomeFields();
    // }

    // @Get('get-products/category?')
    // async getProductsByCategoryId(
    //     @Query('category_id') category_id: number
    // ): Promise<ProductEntity[]> {   
    //     return await this.productService.getProductsByCategoryId(category_id);
    // }


    // @Get('get-products/price?')
    // async getProductsByPriceRange(
    //     @Query('category_id') category_id: number,
    //     @Query('price') price: number
    // ): Promise<ProductEntity[]> {   
    //     console.log(category_id, price)
    //     return await this.productService.getProductsByPriceRange(category_id, price);
    // }


    // @Get('get-products/brand?')
    // async getProductsByBrand(
    //     @Query('category_id') category_id: number,
    //     @Query('brand') brand: string
    // ): Promise<ProductEntity[]> {   
    //     console.log(category_id, brand)
    //     return await this.productService.getProductsByBrand(category_id, brand);
    // }

    
    // @Get('get-products/:category_id/?')
    // async getProductsByFilter(
    //     @Query() filter: ProductFilterDto,
    //     @Param("category_id") category_id: number    
    // ): Promise<ProductEntity[]> {   
    //     console.log("hahahaha")
    //     return this.productService.getProductsByFilter(category_id, filter);
    // }


    @Get('get-products')
    async getProducts(): Promise<ProductEntity[]> {
        return await this.productService.getAll();  
    }

    // @Get('get-products/brand/:category_id')
    // async getProductBrandsByCategoryId(
    //     @Param('category_id') category_id: number
    // ): Promise<string[]> {
    //     return await this.productService.getProductBrandByCategoryId(category_id);  
    // }


    @Get('get-some-field')
    async getProductsSomeField(): Promise<Partial< ProductEntity>[]> {
        console.log("getProductsSomeField:::");
        return await this.productService.getSomeFields()
;    }


    @Get('get-product-ids')
    async getProductsByIds(@Body() data: GetProductForOrderDto[]): Promise<ProductEntity[]> {
        console.log("getProductsByIds - Controller:::", data);
        return await this.productService.getProductsByIds(data);
    }


    @Get(':id')
    async getProduct(@Param('id') id: number): Promise<ProductEntity> {
        return await this.productService.getOneById(id);
    }
}