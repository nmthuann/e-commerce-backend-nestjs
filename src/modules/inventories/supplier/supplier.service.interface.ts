import { SupplierDto } from './supplier.dto'

export interface ISupplierService {
  getAll(): Promise<SupplierDto[]>
}
