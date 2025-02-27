import { SkuAttribute } from 'src/common/types/sku-attribute.type'

export const mapSkuAttributes = (skuAttributes: Record<string, unknown>): SkuAttribute[] => {
  return Object.entries(skuAttributes).map(([key, value]) => ({
    key,
    value
  }))
}
