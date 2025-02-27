import { CategoryDto } from './category.dto'

export interface ICategoryService {
  getAll(): Promise<CategoryDto[]>
  getOneBySlug(categoryUrl: string): Promise<CategoryDto>
}
