import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator'
import { PublicUserDto } from 'src/modules/users/domain/dto/user.dto'

export class CreatePriceDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  sellingPrice: number

  /** Giá niêm yết (gạch ngang); bỏ trống = sellingPrice */
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  displayPrice?: number

  /** Thời điểm bắt đầu áp dụng (ISO 8601); bỏ trống = ngay bây giờ, có thể đặt trong tương lai */
  @IsOptional()
  @IsDateString()
  beginAt?: string
}

export class CurrentPriceDto {
  sellingPrice: number
  displayPrice: number
  beginAt: Date
}

export class PriceHistoryItemDto extends CurrentPriceDto {
  createdAt: Date
  createdBy: PublicUserDto | null
  /** true = giá đang áp dụng; bản ghi có beginAt tương lai là giá đã lên lịch */
  isCurrent: boolean
}
