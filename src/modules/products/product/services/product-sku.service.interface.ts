import { ProductSkuDto } from '../domain/dtos/product-sku.dto'
import { PriceResponse } from '../domain/dtos/responses/price.response'
import { ProductSkuResponse } from '../domain/dtos/responses/product-sku.response'

export interface IProductSkuService {
  getOneById(id: number): Promise<ProductSkuDto>
  getAllByProductId(productId: number): Promise<ProductSkuResponse[]>
  getPricesById(id: number): Promise<PriceResponse[]>
  getCurrentPriceById(id: number): Promise<PriceResponse>
}
