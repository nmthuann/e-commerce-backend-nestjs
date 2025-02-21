import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpuSkuMappingEntity } from './entities/spu-sku-mapping.entity';

@Injectable()
export class ProductsService {

    constructor(
    @InjectRepository(SpuSkuMappingEntity)
        private readonly productsRepository: Repository<SpuSkuMappingEntity>,
    ) {
    }

    async getAll(): Promise<SpuSkuMappingEntity[]> {
        return await this.productsRepository.find(
            {
                relations: ['spu', 'sku'],
            }
        );
    }

}
