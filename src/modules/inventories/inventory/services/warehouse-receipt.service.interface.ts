import { PageDto } from 'src/common/dtos/page.dto'
import { CreateProductSerialDto } from '../domain/dtos/create-product-serial.dto'
import { CreateWarehouseReceiptDto } from '../domain/dtos/create-warehouse-receipt.dto'
import { GetWarehouseReceiptsQueryDto } from '../domain/dtos/get-warehouse-receipts-query.dto'
import { WarehouseReceiptDto } from '../domain/dtos/warehouse-receipt.dto'
import { WarehouseReceiptResponse } from '../domain/dtos/warehouse-receipt.response'

export interface IWarehouseReceiptService {
  createOne(userId: string, data: CreateWarehouseReceiptDto): Promise<WarehouseReceiptDto>
  getOneById(id: number): Promise<WarehouseReceiptDto>
  createProductSerialById(id: number, data: CreateProductSerialDto): Promise<WarehouseReceiptDto>
  getAllWithPagination(query: GetWarehouseReceiptsQueryDto): Promise<PageDto<WarehouseReceiptResponse>>
  getOneByReceiptNumber(receiptNumber: string): Promise<WarehouseReceiptDto>
}
