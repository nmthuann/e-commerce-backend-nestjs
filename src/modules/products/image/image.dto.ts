import { Expose } from "class-transformer";
import { ProductDto } from "../product/product-dto/product.dto";

export class ImageDto {

  @Expose()
  image_id: string;
  product: ProductDto;
  url: string;
}
