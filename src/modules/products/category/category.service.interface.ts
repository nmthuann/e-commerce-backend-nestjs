import { IBaseService } from "../../bases/base.interface";
import { CategoryDto } from "./category-dto/category.dto";
import { CategoryEntity } from "./category.entity";

export interface ICategoryService extends IBaseService<CategoryEntity>{
    //getProdcutByCategoryId(id: number):Promise<CategoryEntity[]>;
}