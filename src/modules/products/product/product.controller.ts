import { Body, Controller, Inject,  Post, Put, Delete, Get, Param } from "@nestjs/common";
import { IProductService } from "./product.service.interface";
import { ProductDto } from "./product-dto/product.dto";

// working with DTO
@Controller('product') 
export class ProductController {
    
    constructor(@Inject('IProductService')
        private productService: IProductService
    ) {}

    @Post('create')
    async createProduct(@Body() product: ProductDto): Promise<ProductDto> {
        return await this.productService.createOne(product);
    }


    @Put('update/:id')
    async updateProductById(@Param('id') id: number, @Body() productDto: ProductDto): Promise<ProductDto> {
        return this.productService.updateOneById(id, productDto);
    }


    @Delete('delete/:id')
    async deleteProductById(@Param('id') id: number): Promise<void> {
        console.log(await this.productService.deleteOneById(id));
    }

    
    @Get('get-products')
    async getProducts(): Promise<ProductDto[]> {
        return await this.productService.getAll();
    }


    @Get(':id')
    async getProduct(@Param('id') id: number): Promise<ProductDto> {
        return await this.productService.getOneById(id);
    }
}