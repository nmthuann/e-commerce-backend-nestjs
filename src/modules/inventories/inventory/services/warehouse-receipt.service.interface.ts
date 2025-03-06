import { CreateProductSerialDto } from '../domain/dtos/create-product-serial.dto'
import { CreateWarehouseReceiptDto } from '../domain/dtos/create-warehouse-receipt.dto'
import { WarehouseReceiptDto } from '../domain/dtos/warehouse-receipt.dto'

export interface IWarehouseReceiptService {
  createOne(userId: string, data: CreateWarehouseReceiptDto): Promise<WarehouseReceiptDto>
  getOneById(id: number): Promise<WarehouseReceiptDto>
  createProductSerialById(id: number, data: CreateProductSerialDto): Promise<WarehouseReceiptDto>
}
