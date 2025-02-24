import { Expose, Transform } from 'class-transformer';

export class ProductDto {
  @Expose()
  id: number;

  @Expose()
  productName: string;

  @Expose()
  slug: string;

  @Expose()
  productLine: string;

  @Expose()
  description?: string;

  @Expose()
  status: boolean;

  @Expose()
  isDeleted: boolean;

  @Expose()
  prioritySort: number;

  @Expose()
  productSpecs?: Record<string, unknown>;

  @Expose()
  categoryId?: number;

  @Expose()
  brandId?: number;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => value.toISOString())
  updatedAt: Date;
}
