export interface IInventoryService {
  getStock(productSkuId: number): Promise<number>
}
