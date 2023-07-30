import { Inject, Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { ProductDto } from "./product-dto/product.dto";
import { IProductService } from "./product.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { Repository } from "typeorm";
import { ICategoryService } from "../category/category.service.interface";
import { IDiscountService } from "../discount/discount.service.interface";
import { CategoryDto } from "../category/category-dto/category.dto";
import { CategoryEntity } from "../category/category.entity";
import { DiscountEntity } from "../discount/discount.entity";

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


  async createOne(data: ProductDto): Promise<ProductEntity> {
    try {
      const newProduct = new ProductEntity();
      newProduct.product_name = data.product_name;
      newProduct.vote = data.vote;
      newProduct.price = data.price;
      newProduct.unit_price = data.unit_price;
      newProduct.quantity = data.quantity;
      newProduct.status = data.status;
      newProduct.description = data.description;
      newProduct.brand = data.brand;
      newProduct.origin = data.origin;
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
      },
    })

      return findProduct;
  }


  // private mapProductEntityToDto(entity: ProductEntity): ProductDto {
  // const dto: ProductDto = {
  //   product_name: entity.product_name,
  //   vote: entity.vote,
  //   price: entity.price,
  //   unit_price: entity.unit_price,
  //   quantity: entity.quantity,
  //   status: entity.status,
  //   description: entity.description,
  //   brand: entity.brand,
  //   origin: entity.origin,
  //   warranty_time: entity.warranty_time,
  //   category: entity.category, // Assuming category is a relation and we want to store only the category id in the DTO
  //   discount: entity.discount, // Assuming discount is a relation and we want to store only the discount id in the DTO
  // };
  //   return dto;
  // }
}