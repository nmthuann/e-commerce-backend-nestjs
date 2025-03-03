import { ApiProperty } from '@nestjs/swagger'

export class CartItemDto {
  @ApiProperty({ description: 'ID của sản phẩm', example: 1 })
  productSkuId: number

  @ApiProperty({ description: 'Tên sản phẩm', example: 'Dầu ăn Oliu 1L' })
  skuName: string

  @ApiProperty({ description: 'Ảnh sản phẩm', example: 'https://example.com/image.jpg' })
  image: string

  @ApiProperty({ description: 'Số lượng sản phẩm trong giỏ', example: 2 })
  quantity: number

  @ApiProperty({ description: 'Giá tại thời điểm thêm vào giỏ', example: 285000 })
  priceAtAdded: number

  @ApiProperty({ description: 'Tổng tiền của sản phẩm trong giỏ', example: 570000 })
  totalItemPrice: number
}

export class CartDto {
  @ApiProperty({ description: 'ID của người dùng', example: '550e8400-e29b-41d4-a716-446655440000' })
  userId: string

  @ApiProperty({ description: 'Danh sách sản phẩm trong giỏ hàng', type: [CartItemDto] })
  items: CartItemDto[]

  @ApiProperty({ description: 'Tổng số sản phẩm trong giỏ hàng', example: 5 })
  totalItems: number

  @ApiProperty({ description: 'Tổng tiền của giỏ hàng', example: 1500000 })
  totalPrice: number
}
