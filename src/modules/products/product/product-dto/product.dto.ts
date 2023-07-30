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
  //images: ImageDto[];
  category: CategoryDto;
  discount: DiscountDto;



  constructor(
    product_name: string,
    vote: number,
    price: number,
    unit_price: number,
    quantity: number,
    status: boolean,
    description: string,
    brand: string,
    origin: string,
    warranty_time: number,
    category: CategoryDto,
    discount: DiscountDto
  ) {

    this.product_name = product_name;
    this.vote = vote;
    this.price = price;
    this.unit_price = unit_price;
    this.quantity = quantity;
    this.status = status;
    this.description = description;
    this.brand = brand;
    this.origin = origin;
    this.warranty_time = warranty_time;
    this.category = category;
    this.discount= discount;
  }

}
