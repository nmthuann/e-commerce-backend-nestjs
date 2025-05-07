import { PageDto } from 'src/common/dtos/page.dto'
import { GetProductSerialsQueryDto } from '../domain/dtos/get-product-serials-query.dto'
import { ProductSerialResponse } from '../domain/dtos/product-serial.response'

export interface IProductSerialService {
  getAllWithPagination(query: GetProductSerialsQueryDto): Promise<PageDto<ProductSerialResponse>>
  getStock(productSkuId: number): Promise<number>
  getProductSerialsBySkuId(productSkuId: number): Promise<ProductSerialResponse[]>
}
