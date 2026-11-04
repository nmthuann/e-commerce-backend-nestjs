// Cây phân quyền (docs/REFACTOR_PLAN.md mục 3):
// USER  = GUEST (không token) | CUSTOMER
// ADMIN = ADMIN | STAFF (phân theo Position)
export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER'
}

export enum Position {
  SALES = 'SALES',
  WAREHOUSE = 'WAREHOUSE'
}
