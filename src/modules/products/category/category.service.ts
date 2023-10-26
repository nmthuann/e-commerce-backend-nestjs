import { Injectable, Inject } from '@nestjs/common';
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
    private categoryRepository: Repository<CategoryEntity>,
  ) {
    super(categoryRepository);
  }

  // async getAll(): Promise<CategoryEntity[]> {
  //     const findCategorys = await this.categoryRepository.find({
  //     relations: {
  //       product: true,
  //     },
  //      })
  //   return findCategorys;
  // }

  // async getProdcutByCategoryId(id: number): Promise<CategoryEntity[]> {
  //    const checkForeignKey = await this.categoryRepository.findBy(
  //     {

  //       products: true
  //     });
  //     return checkForeignKey
  // }

  async deleteOneById(id: number): Promise<DeleteResult> {
    //try {
    const checkForeignKey = await this.categoryRepository.findOneBy({
      category_id: id,
    });
    if (checkForeignKey.category_url) {
      throw Error('Error ForeignKey, So category have more than one Product');
    }
    // else{
    return await this.categoryRepository.softDelete(id);
    // }
  }
}
