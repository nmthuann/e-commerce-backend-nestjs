import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  Index,
} from 'typeorm';
import { WarehouseReceiptEntity } from './warehouse-receipt.entity';
import { ProductSkuEntity } from 'src/modules/products/entities/product-sku.entity';
import { OrderDetailEntity } from 'src/modules/orders/order/domain/entities/order-detail.entity';
import { SerialStatus } from 'src/common/enums/serial-status.enum';

// TODO(P4): hoàn thiện theo thiết kế mới (unit_cost, receipt N-1, …). Cột status thêm sớm ở P3 để tính tồn kho.
@Entity({ name: 'product_serials' })
@Index(['productSku', 'status'])
export class ProductSerialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_number', type: 'varchar', length: 100, unique: true })
  serialNumber: string;

  @Column({ name: 'date_manufactured', type: 'date' })
  dateManufactured: Date;

  @ManyToOne(() => ProductSkuEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_sku_id' })
  productSku: ProductSkuEntity;

  /** Tồn kho SKU = số serial AVAILABLE */
  @Column({ type: 'varchar', length: 20, default: SerialStatus.AVAILABLE })
  status: SerialStatus;

  @ManyToOne(
    () => WarehouseReceiptEntity,
    (warehouseReceipt) => warehouseReceipt.productSerials,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'warehouse_receipt_id' })
  warehouseReceipt: WarehouseReceiptEntity;

  @OneToOne(() => OrderDetailEntity, (orderDetail) => orderDetail.productSerial)
  orderDetail: OrderDetailEntity;
}
