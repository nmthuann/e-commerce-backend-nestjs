import { ProductSkuDto } from '../domain/dtos/product-sku.dto'

export interface IProductSkuService {
  getOneById(id: number): Promise<ProductSkuDto>
}
