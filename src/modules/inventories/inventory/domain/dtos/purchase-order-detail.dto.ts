import { ProductSkuEntity } from 'src/modules/products/entities/product-sku.entity';

export class PurchaseOrderDetailDto {
  sku: SkuDto;
  quantity: number;
  unitPrice: number;
}

export type SkuDto = Pick<
  ProductSkuEntity,
  'id' | 'skuCode' | 'name' | 'attributes' | 'imageUrl' | 'isActive'
>;

export const toSkuDto = (sku: ProductSkuEntity): SkuDto => ({
  id: sku.id,
  skuCode: sku.skuCode,
  name: sku.name,
  attributes: sku.attributes,
  imageUrl: sku.imageUrl,
  isActive: sku.isActive,
});
