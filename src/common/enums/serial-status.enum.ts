// Vòng đời 1 máy (serial): nhập kho → giữ chỗ khi có đơn → bán / hoàn về
export enum SerialStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  RETURNED = 'RETURNED'
}
