import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BrandEntity } from "../../../brand/brand.entity";
import { CategoryEntity } from "../../../category/category.entity";
import { ProductEntity } from "../../domain/entities/product.entity";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(BrandEntity)
        private readonly brandRepository: Repository<BrandEntity>,

        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,

        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,
    ) {

    }
}

