import { ProductDto } from "../product/product-dto/product.dto";

export class ImageDto {
  image_id: string;
  product: ProductDto // You can replace ProductEntity with ProductDTO if you want to use DTO here as well
  url: string;
}
