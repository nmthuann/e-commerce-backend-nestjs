export class CreateProductDto {
  product_id: number;
  model_name: string;
  vote: number;
  price: number;
  unit_price: number;
  quantity: number;
  status: boolean;
  description: string;
  operation_system: string; // brand
  hardware: string; // origin
  warranty_time: number;

  // FK
  // images: ImageDto[];
  // category: CategoryDto;
  // discount: DiscountDto;
  category_id: number;
  discount_id: number;

  // bổ sung
  color: string;
  battery: number;
  screen: number;
  memory: number;
  front_camera: number;
  behind_camera: number;
  ram: number;
}
