import { Injectable } from "@nestjs/common";
import { BaseService } from "src/modules/bases/base.abstract";
import { ProductDto } from "./product-dto/product.dto";
import { IProductService } from "./product.service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProductService extends BaseService<ProductDto> implements IProductService {
  constructor(
    @InjectRepository(ProductEntity) 
    private productRepository: Repository<ProductDto>) {
        super(productRepository);
    }
}