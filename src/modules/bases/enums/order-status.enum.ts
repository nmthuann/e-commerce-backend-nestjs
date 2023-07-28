export enum OrderStatus {
  Pending = 'pending',  // đang chờ ~ in progress
  Confirmed = 'confirmed',  //  đã xác nhận
  Cancelled = 'canceled', //  đã hủy
  Shipped = 'shipped', //  đã giao
  Completed = 'completed', //  đã hoàn thành
  Refunded = 'refunded', //  đã hoàn trả
}