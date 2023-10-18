import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { ProductDto } from "./product-dto/product.dto";
import { IProductService } from "./product.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { And, Between, Repository } from "typeorm";
import { ICategoryService } from "../category/category.service.interface";
import { IDiscountService } from "../discount/discount.service.interface";
import { CategoryDto } from "../category/category-dto/category.dto";
import { CategoryEntity } from "../category/category.entity";
import { DiscountEntity } from "../discount/discount.entity";
import { CreateProductDto } from "./product-dto/create-product.dto";
import { ProductFilterDto } from "./product-dto/product-filter.dto";
import { GetProductForOrderDto } from "./product-dto/get-product-order.dto";

@Injectable()
export class ProductService extends BaseService<ProductEntity> implements IProductService {
  constructor(
    @InjectRepository(ProductEntity) 
    private productRepository: Repository<ProductEntity>,
    @Inject('ICategoryService')
    private categoryService: ICategoryService,
    @Inject('IDiscountService')
    private discountService: IDiscountService

    ) {
        super(productRepository);
    }


  async createOne(data: CreateProductDto): Promise<ProductEntity> {
    try {
      const newProduct = new ProductEntity();
      newProduct.model_name = data.product_name;
      newProduct.vote = data.vote;
      newProduct.price = data.price;
      newProduct.unit_price = data.unit_price;
      newProduct.quantity = data.quantity;
      newProduct.status = data.status;
      newProduct.description = data.description;
      newProduct.operation_system = data.brand;
      newProduct.hardware = data.origin;
      newProduct.warranty_time = data.warranty_time;
      newProduct.category = await this.categoryService.getOneById(data.category as unknown as number);
      newProduct.discount = await this.discountService.getOneById(data.discount as unknown as number);
      const createProduct = await this.productRepository.save(newProduct);
      
      return createProduct ;
    } catch (error) {
      throw new Error(`An unexpected error occurred while creating the Product ${error}`);
    }
  }

  async getOneById(id: string | number ): Promise<ProductEntity> {
    const findProduct = await this.productRepository.findOne({
      where: {
        product_id: id as number,
      },
      relations: {
        category: true,
        discount: true,
        images: true
      },
    })
    return findProduct;
  }

  async getAll(): Promise<ProductEntity[]> {
    const findProducts = await this.productRepository.find({
      relations: {
        category: true,
        discount: true,
        images: true
      },
       })
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
    const findProducts = await this.productRepository.find({})
    return;
  }

  async getProductsByCategoryId(category_id: number): Promise<ProductEntity[]> {
  
    const findProducts = await this.productRepository.find(
      {
        where: {
          category: {
            category_id: category_id
          }
        },
        relations: {
          category: true,
          discount: true,
          images: true
        },
      }
    )
    return findProducts;
  }


  async getProductsByPriceRange(category_id:number, maxPrice: number): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        category: {
            category_id: category_id
          }, 
          price: Between(0, maxPrice),
      },
      relations: {
          category: true,
          discount: true,
          images: true
        },
    });
  }


  async getProductsByBrand(category_id:number,brand: string): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      where: {
        category: {
            category_id: category_id
          }, 
          operation_system: brand
      },
      relations: {
          category: true,
          discount: true,
          images: true
        },
    });
  }


  async getProductsByFilter(category_id: number, filterDto: ProductFilterDto): Promise<ProductEntity[]> {
    const {price, brand } = filterDto;
    console.log(filterDto);
    const query = this.productRepository.createQueryBuilder('product');

    if (category_id) {
      query.andWhere('product.categoryCategoryId = :category_id', { category_id: category_id });
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



  async getProductsByIds(data: GetProductForOrderDto[]): Promise<ProductEntity[]>{
    const productIds: number[] = data.map((product) => product.product_id);
    console.log("productsIds:::: ",productIds);

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
          }
        });

        return product;
      } catch (error) {
        console.error(`Error fetching product with ID ${product_id}:`, error.message);
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
  }

}