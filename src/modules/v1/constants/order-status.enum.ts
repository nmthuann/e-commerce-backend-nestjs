export enum OrderStatus {
  Pending = 'pending', // đang chờ ~ in progress
  Confirmed = 'confirmed', //  đã xác nhận
  Canceled = 'canceled', //  đã hủy
  InProgress = 'in progress', //  đã giao
  Completed = 'completed', //  đã hoàn thành
  Refunded = 'refunded', //  đã hoàn trả
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  RETURNED = 'RETURNED',
  REFUNDED = 'REFUNDED',
}
