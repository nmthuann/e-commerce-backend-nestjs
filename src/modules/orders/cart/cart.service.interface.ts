import { CartDto } from './dtos/cart.dto'
import { CreateCartDto } from './dtos/create-cart.dto'

export interface ICartService {
  createOne(userId: string, data: CreateCartDto): Promise<CartDto>
  deleteOne(userId: string, productSkuId: number): Promise<void>
  getCart(userId: string): Promise<CartDto>
  deleteAllByUserId(userId: string): Promise<void>
}
