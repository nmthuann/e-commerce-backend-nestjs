import { ProductSerialDto } from 'src/modules/inventories/inventory/domain/dtos/product-serial.dto'

export class OrderDetailDto {
  productSerial: ProductSerialDto
  unitPrice: number
  tax: number
}
