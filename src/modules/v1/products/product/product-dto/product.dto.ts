import { CategoryDto } from "../../category/category-dto/category.dto";
import { DiscountDto } from "../../discount/discount-dto/discount.dto";
import { ImageDto } from "../../image/image.dto";

export class ProductDto {
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
  images: ImageDto[];
  category: CategoryDto;
  discount: DiscountDto;

  // bổ sung
  color: string;
  battery: number;
  screen: number;
  memory: number;
  front_camera: number;
  behind_camera: number;
  ram: number;

  constructor(
    model_name: string,
    vote: number,
    price: number,
    unit_price: number,
    quantity: number,
    status: boolean,
    description: string,
    operation_system: string,
    hardware: string,
    warranty_time: number,
    category: CategoryDto,
    discount: DiscountDto,
    color: string,
    battery: number,
    screen: number,
    memory: number,
    front_camera: number,
    behind_camera: number,
    ram: number,
  ) {
    this.model_name = model_name;
    this.vote = vote;
    this.price = price;
    this.unit_price = unit_price;
    this.quantity = quantity;
    this.status = status;
    this.description = description;
    this.operation_system = operation_system;
    this.hardware = hardware;
    this.warranty_time = warranty_time;
    this.category = category;
    this.discount = discount;

    this.color = color;
    this.battery = battery;
    this.screen = screen;
    this.memory = memory;
    this.front_camera = front_camera;
    this.behind_camera = behind_camera;
    this.ram = ram;
  }
}
