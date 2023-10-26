import { Expose } from 'class-transformer';
import { ProductDto } from '../product/product-dto/product.dto';

export class ImageDto {
  @Expose()
  image_id: string;
  product: ProductDto;
  url: string;
}

export class InsertImageDto {
  image_id: string;
  product_id: number;
  url: string;
}
