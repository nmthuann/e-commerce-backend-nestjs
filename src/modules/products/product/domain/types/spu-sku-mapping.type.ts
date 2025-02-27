// TODO: Thống nhất 2 type này thành 1.
export type SpuSkuMappingType = {
  spu: number
  sku: number
  skuname: string
  image: string
  slug: string
  skuattributes: Record<string, unknown>
  sellingprice: number
  displayprice: number
}

export type SpuSkusType = {
  id: number
  skuno: string
  barcode: string
  skuname: string
  image: string
  status: boolean
  skuattributes?: Record<string, unknown>
  slug: string
  sellingprice: number
  displayprice: number
}
