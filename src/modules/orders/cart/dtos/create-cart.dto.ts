import { IsNotEmpty } from 'class-validator'

export class CreateCartDto {
  @IsNotEmpty()
  productSkuId: number

  @IsNotEmpty()
  quantity: number
}
