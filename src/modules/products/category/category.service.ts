import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { BaseService } from 'src/modules/bases/base.abstract';
import { CategoryDto } from './category-dto/category.dto';
import { ICategoryService } from './category.service.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService extends BaseService<CategoryEntity> implements ICategoryService {
  constructor(
    @InjectRepository(CategoryEntity) 
    private categoryRepository: Repository<CategoryEntity>) {
        super(categoryRepository);
    }
}