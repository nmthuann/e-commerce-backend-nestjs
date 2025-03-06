import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { WarehouseReceiptEntity } from './warehouse-receipt.entity'
import { ProductSkuEntity } from 'src/modules/products/product/domain/entities/product-sku.entity'

@Entity({ name: 'product_serials' })
export class ProductSerialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'serial_number', type: 'varchar', length: 100, unique: true })
  serialNumber: string

  @Column({ name: 'date_manufactured', type: 'date' })
  dateManufactured: Date

  @ManyToOne(() => ProductSkuEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_sku_id' })
  productSku: ProductSkuEntity

  @ManyToOne(() => WarehouseReceiptEntity, warehouseReceipt => warehouseReceipt.productSerials, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'warehouse_receipt_id' })
  warehouseReceipt: WarehouseReceiptEntity
}
