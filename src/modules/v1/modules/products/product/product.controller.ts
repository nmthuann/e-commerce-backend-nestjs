import { Body, Controller, Inject, Post, Put, Delete, Get, Param, Query } from '@nestjs/common'
import { IProductService } from './product.service.interface'
import { ProductDto } from './product-dto/product.dto'
import { ProductEntity } from './product.entity'
import { GetProductForOrderDto } from './product-dto/get-product-order.dto'
import { ProductDuplicateDto } from './product-dto/product-duplicate.dto'
import { FilterProductDto } from './product-dto/filter-product.dto'
import { CreateProductDto } from './product-dto/create-product.dto'
import { ProductError } from 'src/modules/v1/constants/errors.enum'
@Controller('product')
export class ProductController {
  constructor(
    @Inject('IProductService')
    private readonly productService: IProductService
  ) {}

  @Post('create')
  async createProduct(@Body() product: CreateProductDto) {
    console.log('Create Product', product)
    let productDuplicate: ProductDuplicateDto = {}
    console.log(product.model_name)
    productDuplicate.model_name = product.model_name
    ;(productDuplicate.hardware = product.hardware),
      (productDuplicate.color = product.color),
      (productDuplicate.screen = product.screen),
      (productDuplicate.battery = product.battery),
      (productDuplicate.memory = product.memory),
      (productDuplicate.front_camera = product.front_camera),
      (productDuplicate.behind_camera = product.behind_camera),
      (productDuplicate.ram = product.ram)
    console.log('productDuplicate', productDuplicate)
    if (await this.productService.checkProductDuplicate(productDuplicate)) {
      console.log('ssssss', { message: ProductError.PRODUCT_DUPLICATE })
      return { message: ProductError.PRODUCT_DUPLICATE }
    } else {
      return await this.productService.createOne(product)
    }
  }

  @Put('update/:id')
  async updateProductById(@Param('id') id: number, @Body() productDto: ProductDto): Promise<ProductDto> {
    return this.productService.updateOneById(id, productDto)
  }

  @Delete('delete/:id')
  async deleteProductById(@Param('id') id: number): Promise<void> {
    console.log(await this.productService.deleteOneById(id))
  }

  @Get('get-products/category?')
  async getProductsByCategoryId(@Query('category_id') category_id: number): Promise<ProductEntity[]> {
    return await this.productService.getProductsByCategoryId(category_id)
  }

  @Get('get-newest-products')
  async getNewestProducts(): Promise<ProductEntity[]> {
    const topProduct = 15
    return await this.productService.getNewestProducts(topProduct)
  }

  @Get('get-products')
  async getProducts(): Promise<ProductEntity[]> {
    return await this.productService.getAll()
  }

  @Get('get-some-field')
  async getProductsSomeField(): Promise<Partial<ProductEntity>[]> {
    console.log('getProductsSomeField:::')
    return await this.productService.getSomeFields()
  }

  @Get('get-product-ids')
  async getProductsByIds(@Body() data: GetProductForOrderDto[]): Promise<ProductEntity[]> {
    console.log('getProductsByIds - Controller:::', data)
    return await this.productService.getProductsByIds(data)
  }

  @Get('get-product-by-ids')
  async getProductsByProductIds(@Body() data: { productIds: number[] }): Promise<ProductEntity[]> {
    console.log('getProductsByProductIds - Controller:::', data)
    const productIds = data.productIds
    return await this.productService.getProductsByProductIds(productIds)
  }

  @Post('get-product-duplicate')
  async getProductDuplicate(@Body() data: ProductDuplicateDto) {
    const getProductDuplicate = await this.productService.checkProductDuplicate(data)
    // return getProductDuplicate;
    if (getProductDuplicate) {
      return getProductDuplicate
    }
    return { message: ProductError.PRODUCT_DUPLICATE }
  }

  @Get('filter-by-ram/:ram')
  async filterProductByRam(@Param('ram') ram: number) {
    return await this.productService.createFilterProductsByCategory(1)
  }

  @Get('filter-products')
  async filterProducts(@Body() data: FilterProductDto) {
    const result = await this.productService.filterProducts(data)
    if (result.length) {
      return result
    }
    return { message: ProductError.FILTER_PRODUCT_ERROR }
  }

  @Get('get-model-name')
  async getModelName() {
    const search = await this.productService.getModelName()
    return search
  }

  @Get(':product_id')
  async getProduct(@Param('product_id') id: number): Promise<ProductEntity> {
    console.log('Check', id)
    return await this.productService.getOneById(id)
  }
}
