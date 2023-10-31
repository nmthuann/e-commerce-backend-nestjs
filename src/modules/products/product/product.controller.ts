import {
  Body,
  Controller,
  Inject,
  Post,
  Put,
  Delete,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { IProductService } from './product.service.interface';
import { ProductDto } from './product-dto/product.dto';
import { ProductEntity } from './entities/product.entity';

import { GetProductForOrderDto } from './product-dto/get-product-order.dto';
import { ProductDuplicateDto } from './product-dto/product-duplicate.dto';

// working with DTO
@Controller('product')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private productService: IProductService,
  ) {}

  @Post('create')
  async createProduct(@Body() product: ProductDto): Promise<ProductEntity> {
    console.log('Create Product', product);
    // const createProduct = await this.productService.createOne(product);
    // return createProduct // plainToClass(ProductDto, createProduct)
    return await this.productService.createOne(product);
  }

  @Put('update/:id')
  async updateProductById(
    @Param('id') id: number,
    @Body() productDto: ProductDto,
  ): Promise<ProductDto> {
    return this.productService.updateOneById(id, productDto);
  }

  @Delete('delete/:id')
  async deleteProductById(@Param('id') id: number): Promise<void> {
    console.log(await this.productService.deleteOneById(id));
  }

  @Get('get-products/category?')
  async getProductsByCategoryId(
    @Query('category_id') category_id: number,
  ): Promise<ProductEntity[]> {
    return await this.productService.getProductsByCategoryId(category_id);
  }

  @Get('get-newest-products')
  async getNewestProducts(): Promise<ProductEntity[]> {
    const topProduct = 15;
    return await this.productService.getNewestProducts(topProduct);
  }

  @Get('get-products')
  async getProducts(): Promise<ProductEntity[]> {
    return await this.productService.getAll();
  }

  @Get('get-some-field')
  async getProductsSomeField(): Promise<Partial<ProductEntity>[]> {
    console.log('getProductsSomeField:::');
    return await this.productService.getSomeFields();
  }

  @Get('get-product-ids')
  async getProductsByIds(
    @Body() data: GetProductForOrderDto[],
  ): Promise<ProductEntity[]> {
    console.log('getProductsByIds - Controller:::', data);
    return await this.productService.getProductsByIds(data);
  }

  @Get('get-product-by-ids')
  async getProductsByProductIds(
    @Body() data: { productIds: number[] },
  ): Promise<ProductEntity[]> {
    console.log('getProductsByProductIds - Controller:::', data);
    const productIds = data.productIds;
    return await this.productService.getProductsByProductIds(productIds);
  }


  @Get('get-product-duplicate')
  async getProductDuplicate(
    @Body() data: ProductDuplicateDto,
  ) {
    const getProductDuplicate = await this.productService.checkProductDuplicate(data);
    if(getProductDuplicate) {
      return getProductDuplicate;
    }
    return {message: 'Product is valid!'};
  }



  @Get(':product_id')
  async getProduct(@Param('product_id') id: number): Promise<ProductEntity> {
    console.log('Check', id);
    return await this.productService.getOneById(id);
  }
}

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

// @Get('get-products')
// async getProducts(): Promise<Partial<ProductEntity>[]> {
//     return await this.productService.getSomeFields();
// }

// @Get('get-products/brand/:category_id')
// async getProductBrandsByCategoryId(
//     @Param('category_id') category_id: number
// ): Promise<string[]> {
//     return await this.productService.getProductBrandByCategoryId(category_id);
// }
