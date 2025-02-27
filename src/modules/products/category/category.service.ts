import { Injectable } from '@nestjs/common'
import { ICategoryService } from './category.service.interface'
import { InjectRepository } from '@nestjs/typeorm'
import { CategoryEntity } from './category.entity'
import { Repository } from 'typeorm'
import { CategoryDto } from './category.dto'

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  async getAll(): Promise<CategoryDto[]> {
    const categories = await this.categoryRepository.find()
    return categories.map(cat => new CategoryDto(cat))
  }

  async getOneBySlug(categoryUrl: string): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { categoryUrl } })
    return new CategoryDto(category)
  }
}
