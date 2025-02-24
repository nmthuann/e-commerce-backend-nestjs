import { IBaseService } from '../../../common/bases/base.interface';
import { ProductEntity } from './product.entity';
import { FilterProductDto } from './product-dto/filter-product.dto';
import { GetProductForOrderDto } from './product-dto/get-product-order.dto';
import { ProductDuplicateDto } from './product-dto/product-duplicate.dto';
import { ProductFilterDto } from './product-dto/product-filter.dto';

export interface IProductService extends IBaseService<ProductEntity> {
  getSomeFields(): Promise<Partial<ProductEntity>[]>;
  getProductsByCategoryId(category_id: number): Promise<ProductEntity[]>;
  getProductsByPriceRange(
    category_id: number,
    maxPrice: number,
  ): Promise<ProductEntity[]>;
  getProductsByBrand(
    category_id: number,
    brand: string,
  ): Promise<ProductEntity[]>;
  getProductsByFilter(
    category_id: number,
    options: ProductFilterDto,
  ): Promise<ProductEntity[]>;
  getProductBrandByCategoryId(category_id: number): Promise<string[]>;
  getProductsByIds(data: GetProductForOrderDto[]): Promise<ProductEntity[]>;
  getProductsByProductIds(ids: number[]): Promise<ProductEntity[]>;
  getNewestProducts(topProduct: number): Promise<ProductEntity[]>;
  checkInventoryOrderOnline(product_ids: number[]): Promise<boolean>;
  // findProductsByIds(ids: number[]);
  checkProductDuplicate(product: ProductDuplicateDto):Promise<ProductEntity>;
  //function* createFilterProducts();
  filterProducts(data: FilterProductDto): Promise<ProductEntity[]>;
  createFilterProductsByRam(ram: number);
  createFilterProductsByMemory(memory: number);
  createFilterProductsByCategory(category: number);
  createFilterProductsByPrice(minPrice: number, maxPrice: number);
  filterProductsByRam(products: ProductEntity[], ram: number);
  filterProductsByMemory(products: ProductEntity[], memory: number);
  filterProductsByCategory(products: ProductEntity[], category: number);
  filterProductsByPrice(products: ProductEntity[], minPrice: number, maxPrice: number);
  getModelName();
}
