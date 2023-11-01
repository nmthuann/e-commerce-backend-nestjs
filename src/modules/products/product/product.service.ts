import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/bases/base.abstract';
import { IProductService } from './product.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Between, Repository } from 'typeorm';
import { ICategoryService } from '../category/category.service.interface';
import { IDiscountService } from '../discount/discount.service.interface';
import { CreateProductDto } from './product-dto/create-product.dto';
import { ProductFilterDto } from './product-dto/product-filter.dto';
import { GetProductForOrderDto } from './product-dto/get-product-order.dto';
import { ProductError } from 'src/common/errors/errors';
import { ProductDuplicateDto } from './product-dto/product-duplicate.dto';
import { FilterProductDto } from './product-dto/filter-product.dto';

@Injectable()
export class ProductService
  extends BaseService<ProductEntity>
  implements IProductService
{
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @Inject('ICategoryService')
    private categoryService: ICategoryService,
    @Inject('IDiscountService')
    private discountService: IDiscountService,
  ) {
    super(productRepository);
  }


  createFilterProductsByRam(ram: number) {
    throw new Error('Method not implemented.');
  }


  createFilterProductsByMemory(memory: number) {
    throw new Error('Method not implemented.');
  }


  createFilterProductsByCategory(category: number) {
    throw new Error('Method not implemented.');
  }

  
  createFilterProductsByPrice(minPrice: number, maxPrice: number) {
    throw new Error('Method not implemented.');
  }


  // //products: Product[], filterFunc: (product: Product) => boolean
  // *createFilterProducts(): Generator<ProductEntity[]> {
  //   // for (const product of products) {
  //   //   if (filterFunc(product)) {
  //   //     yield product;
  //   //   }
  //   // }
  // }


  async filterProducts(data: FilterProductDto): Promise<ProductEntity[]> {
    throw new Error('Method not implemented.');
  }
  
  async checkProductDuplicate(product: ProductDuplicateDto): Promise<ProductEntity>{
    const productDuplicate = await this.productRepository.findOne({
      where:{
        model_name: product.model_name,
        hardware: product.hardware,
        color: product.color,
        screen: product.screen,
        battery: product.battery,
        memory: product.memory,
        front_camera: product.front_camera,
        behind_camera: product.behind_camera,
        ram: product.ram
      }
    })
    return productDuplicate;
  }

  async checkInventoryOrderOnline(product_ids: number[]): Promise<boolean> {
    let check = true; // Biến cờ, mặc định tất cả sản phẩm đều còn hàng tồn

    for (const product_id of product_ids) {
      const product = await this.productRepository.findOneById(product_id);
      if (product) {
        const quantity = product.quantity;
        if (quantity <= 0) {
          check = false;
        }
      } else {
        check = false;
      }
    }
    return check;
  }

  async createOne(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const newProduct = new ProductEntity();
      newProduct.model_name = data.model_name;
      newProduct.price = data.price;
      newProduct.unit_price = data.unit_price;
      newProduct.quantity = data.quantity;
      newProduct.status = true;
      newProduct.description = data.description;
      newProduct.operation_system = data.operation_system;
      newProduct.hardware = data.hardware;
      newProduct.warranty_time = data.warranty_time;
      (newProduct.screen = data.screen), (newProduct.vote = 0);
      newProduct.color = data.color;
      newProduct.battery = data.battery;
      newProduct.memory = data.memory;
      newProduct.front_camera = data.front_camera;
      newProduct.behind_camera = data.behind_camera;
      newProduct.ram = data.ram;
      newProduct.category = await this.categoryService.getOneById(
        data.category_id as unknown as number,
      );
      newProduct.discount = await this.discountService.getOneById(
        data.discount_id as unknown as number,
      );
      const createProduct = await this.productRepository.save(newProduct);

      return createProduct;
    } catch (error) {
      // throw new Error(`An unexpected error occurred while creating the Product ${error}`);
      console.log(`${error}`);
      throw new Error(ProductError.CREATE_PRODUCT_ERROR);
    }
  }

  async getOneById(id: string | number): Promise<ProductEntity> {
    const findProduct = await this.productRepository.findOne({
      where: {
        product_id: id as number,
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
    return findProduct;
  }

  async getAll(): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.find({
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
    return findProducts;
  }

  async getSomeFields(): Promise<Partial<ProductEntity>[]> {
    const findProducts = await this.productRepository
      .createQueryBuilder('product')
      .select([
        'product.product_id',
        'product.product_name',
        'product.vote',
        'product.price',
        'product.discount',
      ])
      .leftJoinAndSelect('product.discount', 'discount')
      .getMany();

    return findProducts;
  }

  async getProductsByOptions(data: any): Promise<Partial<ProductEntity>[]> {
    const findProducts = await this.productRepository.find({});
    return;
  }

  async getProductsByCategoryId(category_id: number): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.find({
      where: {
        category: {
          category_id: category_id,
        },
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
    return findProducts;
  }

  async getProductsByPriceRange(
    category_id: number,
    maxPrice: number,
  ): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        category: {
          category_id: category_id,
        },
        price: Between(0, maxPrice),
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
  }

  async getProductsByBrand(
    category_id: number,
    brand: string,
  ): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        category: {
          category_id: category_id,
        },
        operation_system: brand,
      },
      relations: {
        category: true,
        discount: true,
        images: true,
      },
    });
  }

  async getProductsByFilter(
    category_id: number,
    filterDto: ProductFilterDto,
  ): Promise<ProductEntity[]> {
    const { price, brand } = filterDto;
    console.log(filterDto);
    const query = this.productRepository.createQueryBuilder('product');

    if (category_id) {
      query.andWhere('product.categoryCategoryId = :category_id', {
        category_id: category_id,
      });
    }

    if (price) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: price });
    }

    if (brand) {
      query.andWhere('product.brand LIKE :brand', { brand: `%${brand}%` });
    }
    return query.getMany();
  }

  async getProductBrandByCategoryId(category_id: number): Promise<string[]> {
    const query = this.productRepository.createQueryBuilder('product');
    query.select('DISTINCT product.brand');
    query.where('product.categoryCategoryId = :category_id', { category_id });
    const result = await query.getRawMany();
    return result.map((item) => item.brand);
  }

  async getProductsByIds(
    data: GetProductForOrderDto[],
  ): Promise<ProductEntity[]> {
    const productIds: number[] = data.map((product) => product.product_id);
    console.log('productsIds:::: ', productIds);

    // const products: ProductEntity[] = [];

    /// Use 'map' instead of 'forEach'
    const getProduct = productIds.map(async (product_id) => {
      try {
        // Fetch the product by its ID and return it
        const product = await this.productRepository.findOne({
          where: {
            product_id: product_id,
          },
          relations: {
            // category: true,
            discount: true,
          },
        });

        return product;
      } catch (error) {
        console.error(
          `Error fetching product with ID ${product_id}:`,
          error.message,
        );
      }
    });

    // Use 'Promise.all' to wait for all the async operations to complete
    const products = await Promise.all(getProduct);

    // Filter out any potential 'undefined' values (e.g., if findOne() throws an error)filter((product) => !!product) as ProductEntity[];
    return products;
  }

  async getProductsByProductIds(ids: number[]): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.findByIds(ids);
    return findProducts;
    // try {
    //   const findProducts = await this.productRepository.findByIds(ids);
    //   if (findProducts.length !== ids.length) {
    //     throw new NotFoundException("Không tìm thấy một số sản phẩm.");
    //   }
    //   return findProducts;
    // } catch (error) {
    //   throw new NotFoundException("Không tìm thấy một số sản phẩm.");
    // }
  }

  async getNewestProducts(topProduct: number): Promise<ProductEntity[]> {
    const newestProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image')
      .where('product.status = :status', { status: true })
      .orderBy('product.created_at', 'DESC')
      .limit(topProduct)
      .getMany();

    return newestProducts;
  }
}
