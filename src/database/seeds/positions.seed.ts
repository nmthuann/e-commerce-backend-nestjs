import { Position } from 'src/common/enums/role.enum'
import { PositionEntity } from 'src/modules/users/positions/position.entity'
import type { Seeder } from './run-seed'

const POSITIONS: Pick<PositionEntity, 'code' | 'name' | 'description'>[] = [
  { code: Position.SALES, name: 'Nhân viên bán hàng', description: 'Xử lý đơn hàng, bán tại quầy, hóa đơn và bảo hành' },
  { code: Position.WAREHOUSE, name: 'Nhân viên kho', description: 'Nhà cung cấp, đơn đặt hàng, phiếu nhập và serial' }
]

export const positionsSeeder: Seeder = {
  name: 'positions',
  run: async dataSource => {
    // upsert theo code → chạy lại không tạo trùng, chỉ cập nhật tên / mô tả
    await dataSource.getRepository(PositionEntity).upsert(POSITIONS, ['code'])
  }
}
