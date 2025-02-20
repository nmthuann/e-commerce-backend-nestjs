import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { BaseService } from 'src/modules/bases/base.abstract';
import { ICategoryService } from './category.service.interface';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService
  extends BaseService<CategoryEntity>
  implements ICategoryService
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }
  async deleteOneById(id: number): Promise<DeleteResult> {
    const checkForeignKey = await this.categoryRepository.findOneBy({
      category_id: id,
    });
    if (checkForeignKey.category_url) {
      throw Error('Error ForeignKey, So category have more than one Product');
    }
    return await this.categoryRepository.softDelete(id);
  }
}
