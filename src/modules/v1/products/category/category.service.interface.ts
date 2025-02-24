import { IBaseService } from 'src/modules/v1/bases/base.interface';
import { CategoryEntity } from './category.entity';

export type ICategoryService = IBaseService<CategoryEntity>;
