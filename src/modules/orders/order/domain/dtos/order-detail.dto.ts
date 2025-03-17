import { ProductSerialDto } from 'src/modules/inventories/inventory/domain/dtos/product-serial.dto'

export class OrderDetailDto {
  productSerial: Omit<ProductSerialDto, 'sku'>
  unitPrice: number
  tax: number
}
