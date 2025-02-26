import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';

export class GetProductsQueryDto extends PageOptionsDto{
  @IsOptional()
  @Type(() => String)
  categoryUrl?: string;

  @IsOptional()
  @Type(() => String)
  brandUrl?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
