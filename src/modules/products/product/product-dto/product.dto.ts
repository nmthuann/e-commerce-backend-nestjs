import { CategoryDto } from "../../category/category-dto/category.dto";
import { DiscountDto } from "../../discount/discount-dto/discount.dto";
import { ImageDto } from "../../image/image.dto";

export class ProductDto {
  product_id: number;
  product_name: string;
  vote: number;
  price: number;
  unit_price: number;
  quantity: number;
  status: boolean;
  description: string;
  brand: string;
  origin: string;
  warranty_time: number;
  images: ImageDto[]; // You need to import ImageEntity if not already imported
  category: CategoryDto;
  discount: DiscountDto;
}
