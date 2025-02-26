import { Expose } from 'class-transformer';
import { IsString} from 'class-validator';

export class CreateCategoryDto {
  @Expose()
  @IsString()
  category_name: string;

  @Expose()
  @IsString()
  description: string;
}
