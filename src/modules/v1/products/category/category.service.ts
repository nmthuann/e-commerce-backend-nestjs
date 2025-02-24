import { Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { ICategoryService } from './category.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractBaseService } from 'src/modules/v1/bases/base.abstract.service';

@Injectable()
export class CategoryService
  extends AbstractBaseService<CategoryEntity>
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
