import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductError } from 'src/common/enums/errors.enum'
import { toSlug } from 'src/common/utils/slug.util'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { CategoryEntity } from '../entities/category.entity'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find({ order: { name: 'ASC' } })
  }

  async findOne(where: { id: number } | { slug: string }): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOneBy(where)
    if (!category) throw new NotFoundException(ProductError.CATEGORY_NOT_FOUND)
    return category
  }

  // Trùng name / slug → AllExceptionsFilter trả 409
  create(data: CreateCategoryDto): Promise<CategoryEntity> {
    return this.categoryRepository.save(this.categoryRepository.create({ ...data, slug: data.slug ?? toSlug(data.name) }))
  }

  async update(id: number, data: UpdateCategoryDto): Promise<CategoryEntity> {
    await this.findOne({ id })
    await this.categoryRepository.update({ id }, data)
    return this.findOne({ id })
  }

  // Danh mục còn sản phẩm → FK RESTRICT → AllExceptionsFilter trả 400
  async remove(id: number): Promise<void> {
    await this.findOne({ id })
    await this.categoryRepository.delete({ id })
  }
}
