import { Attribute } from 'src/common/types/attribute.type'

export const mapAttributes = (skuAttributes: Record<string, unknown>): Attribute[] => {
  return Object.entries(skuAttributes).map(([key, value]) => ({
    key,
    value
  }))
}
