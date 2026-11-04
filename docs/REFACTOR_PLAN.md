# Kế hoạch Refactor — E-commerce Backend (NestJS)

> Store bán điện thoại / đồng hồ thông minh / laptop / Linh kiện điển tử. Quy mô vừa, 1 cửa hàng. Nghiệp vụ lõi: **quản lý tồn kho theo số serial**.
> Tài liệu này là **plan task**. Thiết kế chi tiết sẽ nằm ở `docs/DESIGN.md` (task P6.1).

---

## 0. Hiện trạng (khảo sát ngày 2026-11-04)

| Hạng mục          | Tình trạng                                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build             | `tsc` lỗi 7 chỗ, toàn bộ ở `orders/order/services/impl/order.service.ts` (`createOne` viết dở). App **không chạy được**.                                                               |
| `src/modules/v1/` | ~5.400 dòng code cũ (MSSQL, OTP mail, discount, shipping…) — không được import, chỉ là rác.                                                                                            |
| Code hiện tại     | ~4.100 dòng; mỗi service có `interface` + token chuỗi `'IXService'`, thư mục `domain/dtos/...` lồng sâu → nhiều file thừa.                                                             |
| Auth              | Chỉ có `login`; `register` = `throw`. `AuthMiddleware` gắn thủ công từng module với danh sách `exclude` rời rạc; 3 guard (`admin/user/common`) gần như trùng nhau.                     |
| Config            | `dotenv.config()` rải ở 5+ file, không có `ConfigModule`; `OrderModule` inject `ConfigService` nhưng chưa import → crash khi boot.                                                     |
| DB                | Postgres, `synchronize: false`, **chưa có migration nào**; entity load bằng glob `dist/**`.                                                                                            |
| Swagger           | Đã cài `@nestjs/swagger` và setup ở `main.ts` nhưng chưa có decorator / bearer auth.                                                                                                   |
| Lỗi nghiệp vụ     | `ProductSerial` không có trạng thái → không tính được tồn kho; PO ↔ phiếu nhập là 1-1 (không nhập nhiều đợt); Stripe tạo order rỗng, xóa cart trước khi thanh toán; webhook chưa làm. |
| Phụ thuộc thừa    | `mssql`, `nodemailer`, `cache-manager*`, `ioredis`, `@types/axios`, `@types/cache-manager*`.                                                                                           |

---

## 1. Quyết định thiết kế (cần bạn xác nhận)

| #   | Vấn đề                       | Đề xuất                                                                                                                                                                                                                                                                                                                                                                                                | Lý do                                                                                                                                                                                                                                  |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Cart server hay cart ảo?** | **Bỏ bảng `cart_items`, dùng cart ảo trên frontend (localStorage)** + endpoint `POST /orders/preview` để backend kiểm tra tồn kho & giá hiện hành.                                                                                                                                                                                                                                                     | Giá và tồn kho luôn phải tính lại lúc đặt hàng nên cart server không giữ được gì có giá trị; khách vãng lai vẫn bỏ được hàng vào giỏ; bớt 1 module. Đánh đổi: không đồng bộ giỏ giữa các thiết bị — chấp nhận được với quy mô 1 store. |
| D2  | Khi nào gán serial cho đơn?  | **Giữ chỗ (RESERVED) ngay lúc tạo đơn**, tự cấp theo FIFO (serial nhập sớm bán trước), dùng `SELECT … FOR UPDATE SKIP LOCKED` trong transaction.                                                                                                                                                                                                                                                       | Chống bán vượt tồn khi 2 khách mua cùng lúc; `order_details` giữ nguyên dạng 1 dòng / 1 serial như thiết kế hiện tại.                                                                                                                  |
| D3  | PO ↔ phiếu nhập             | **1 PO : N phiếu nhập** (nhập nhiều đợt), ràng buộc tổng serial đã nhập theo SKU ≤ số lượng đặt.                                                                                                                                                                                                                                                                                                       | Nhà cung cấp hay giao thiếu/giao nhiều đợt. Chi phí thêm chỉ là 1 phép kiểm tra.                                                                                                                                                       |
| D4  | Invoice / Warranty           | **Giữ `invoices`, `warranties`, `warranty_details`.** Khi đơn **thanh toán xong** (`payment_status → PAID`) hệ thống tự phát hành trong **cùng 1 transaction**: 1 hóa đơn cho đơn + 1 phiếu bảo hành cho **mỗi serial** trong đơn (hạn = ngày phát hành + `products.warranty_months`). `warranty_details` = các lần tiếp nhận bảo hành của 1 phiếu. Hóa đơn & phiếu bảo hành **không sửa, không xóa**. | Mỗi máy có serial và hạn bảo hành riêng; hóa đơn lưu snapshot số tiền tại thời điểm thanh toán nên không bị ảnh hưởng khi giá đổi.                                                                                                     |
| D5  | Phân quyền theo vị trí       | `users.role` ∈ `ADMIN / STAFF / CUSTOMER`; nhân viên có `employees.position_id` → `positions.code` ∈ `SALES / WAREHOUSE` (mở rộng được).                                                                                                                                                                                                                                                               | Khớp cây quyền bạn đưa ra, xem mục 3.                                                                                                                                                                                                  |
| D6  | Dữ liệu DB hiện có           | **Tạo lại schema bằng 1 migration khởi tạo mới** + seed. Không viết migration chuyển dữ liệu cũ.                                                                                                                                                                                                                                                                                                       | Chưa có migration nào; giả định dữ liệu hiện tại chỉ là dữ liệu dev.                                                                                                                                                                   |
| D7  | Đơn bán tại quầy             | Có: nhân viên SALES tạo đơn bằng cách **quét serial** (`POST /admin/orders`), dùng chung service với đơn online.                                                                                                                                                                                                                                                                                       | Store có cửa hàng vật lý; tận dụng đúng đặc thù serial.                                                                                                                                                                                |

---

## 2. Kiến trúc đích

### 2.1 Cấu trúc thư mục

```
src/
├─ main.ts                      # bootstrap, global pipe, swagger, raw body cho webhook
├─ app.module.ts                # import module, đăng ký APP_GUARD / APP_INTERCEPTOR / APP_FILTER, middleware
├─ config/                      # env.validation.ts, typeorm.config.ts, swagger.config.ts
├─ database/
│  ├─ datasource.ts             # giữ tên file hiện có; dùng chung cho app + TypeORM CLI
│  ├─ migrations/
│  └─ seeds/                    # admin, positions, brand/category/product mẫu
├─ common/
│  ├─ decorators/               # @Public, @Roles, @Positions, @CurrentUser
│  ├─ middlewares/              # request-id, logger, auth-context (parse token mềm)
│  ├─ guards/                   # auth.guard, roles.guard
│  ├─ interceptors/             # transform (envelope response), logging/timing
│  ├─ filters/                  # all-exceptions.filter (HttpException + QueryFailedError)
│  ├─ dto/                      # pagination (page-options, page-meta, page)
│  ├─ enums/                    # role, position, order-status, payment, serial-status…
│  └─ entities/base.entity.ts
└─ modules/
   ├─ auth/                     # register, login, refresh, logout, me
   ├─ users/                    # users, employees, positions
   ├─ products/                 # brands, categories, products, skus, prices
   ├─ inventory/                # suppliers, purchase-orders, warehouse-receipts, serials
   └─ orders/                   # orders, payments (stripe), invoices, warranties
```

Quy ước mỗi sub-feature: `x.entity.ts`, `x.dto.ts` (hoặc `dto/`), `x.service.ts`, `x.controller.ts`. **Bỏ interface + token chuỗi**, inject class trực tiếp.

### 2.2 Request lifecycle (theo docs NestJS)

```
Request
 → Middleware (global):   RequestIdMiddleware → LoggerMiddleware → AuthContextMiddleware
                           (đọc Bearer token nếu có, verify, gắn req.user; KHÔNG chặn request)
 → Guards (APP_GUARD):    AuthGuard   – route không @Public() mà không có req.user → 401
                          RolesGuard  – kiểm @Roles(...) và @Positions(...) → 403
 → Pipes:                 ValidationPipe global (whitelist, transform), ParseIntPipe/ParseUUIDPipe
 → Controller → Service (transaction cho nghiệp vụ kho/đơn)
 → Interceptors (after):  TransformInterceptor → { success, data, meta? }
 → Exception filter:      AllExceptionsFilter → { success:false, statusCode, message, path, requestId }
                          (map lỗi Postgres 23505 → 409, 23503 → 400)
```

---

## 3. Cây phân quyền

```
ALL
├─ USER
│  ├─ GUEST     (không token)         : xem sản phẩm, preview giỏ, đăng ký/đăng nhập, tra bảo hành
│  └─ CUSTOMER  (role=CUSTOMER)       : + đặt hàng, thanh toán, xem/hủy đơn của mình, xem hóa đơn & phiếu bảo hành của mình, sửa hồ sơ
└─ ADMIN
   ├─ ADMIN     (role=ADMIN)          : toàn quyền (nhân sự, vị trí, catalog, giá, kho, đơn, hóa đơn, bảo hành, báo cáo)
   └─ STAFF     (role=STAFF, theo position)
      ├─ SALES     : xử lý đơn (xác nhận/giao/hoàn tất/hủy), bán tại quầy, xem hóa đơn, tiếp nhận/trả bảo hành, xem khách hàng
      └─ WAREHOUSE : nhà cung cấp, đơn đặt hàng, phiếu nhập, serial
```

- JWT payload: `{ sub, email, role, position? }`.
- `@Roles(Role.ADMIN, Role.STAFF)` + `@Positions(Position.SALES)`: ADMIN luôn qua; STAFF phải đúng position.

---

## 4. Mô hình dữ liệu đích (tóm tắt)

| Domain    | Bảng                     | Ghi chú chính                                                                                                                                                                                                                                                                |
| --------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User      | `users`                  | uuid, email unique, password_hash, full_name, phone, `role`, `status`, `refresh_token_hash`                                                                                                                                                                                  |
|           | `positions`              | id, `code` unique (SALES/WAREHOUSE), name                                                                                                                                                                                                                                    |
|           | `employees`              | id, `user_id` unique → users, `position_id`, salary, hired_at, is_active                                                                                                                                                                                                     |
| Product   | `brands`, `categories`   | name unique, slug unique (tự sinh từ name, bỏ dấu); brand có logo_url                                                                                                                                                                                                                                                                  |
|           | `products` (SPU)         | name, slug, brand_id, category_id (RESTRICT), specs jsonb, `warranty_months`, is_active, sort_order                                                                                                                                                                                                 |
|           | `product_skus`           | sku_code unique (không đổi), name, attributes jsonb (màu, dung lượng…), image_url, is_active                                                                                                                                                                                                 |
|           | `spu_sku_mapping`        | PK (spu_id, sku_id) + unique index sku_id (1 SKU thuộc 1 SPU)                                                                                                                                                                                                                         |
|           | `prices`                 | **PK (product_sku_id, begin_at timestamptz)**, selling_price, display_price (>= selling), created_by → users. **Chỉ INSERT, không UPDATE/DELETE.** Giá hiện hành = bản ghi `begin_at <= now()` mới nhất.                                                                                                      |
| Inventory | `suppliers`              | name, phone, email, address                                                                                                                                                                                                                                                  |
|           | `purchase_orders`        | code, supplier_id, created_by, status `DRAFT → ORDERED → PARTIAL → RECEIVED / CANCELLED`                                                                                                                                                                                     |
|           | `purchase_order_details` | PK (po_id, sku_id), quantity, unit_cost                                                                                                                                                                                                                                      |
|           | `warehouse_receipts`     | code, po_id (N-1), received_by, received_at, note                                                                                                                                                                                                                            |
|           | `product_serials`        | **= chi tiết phiếu nhập**: serial_number unique, product_sku_id, receipt_id, unit_cost, `status AVAILABLE / RESERVED / SOLD / RETURNED`                                                                                                                                              |
| Order     | `orders`                 | code, user_id (null nếu bán quầy khách lẻ), staff_id, `channel ONLINE/POS`, status, payment_method `COD/STRIPE/CASH`, payment_status, receiver_name/phone/address, subtotal, shipping_fee, total, stripe_session_id, note                                                    |
|           | `order_details`          | PK (order_id, product_serial_id), sku_id, unit_price (snapshot)                                                                                                                                                                                                              |
|           | `invoices`               | code unique (`INV-YYYYMMDD-xxxxx`), `order_id` unique (1-1), issued_by → employees (null nếu phát hành tự động qua Stripe), issued_at, buyer_name/phone/address, buyer_tax_code (nullable), payment_method, subtotal, tax_rate, tax_amount, total — **snapshot, chỉ INSERT** |
|           | `warranties`             | code unique (`WAR-…`), `product_serial_id` unique, invoice_id → invoices, start_date, end_date, status `ACTIVE / EXPIRED / VOID`                                                                                                                                             |
|           | `warranty_details`       | PK (warranty_id, received_at), returned_at, before_status (tình trạng lúc nhận), after_status (kết quả xử lý), received_by → employees                                                                                                                                       |

**Bất biến nghiệp vụ:**

1. Tồn kho SKU = `COUNT(product_serials WHERE product_sku_id = ? AND status = 'AVAILABLE')` — không lưu cột số lượng.
2. Phiếu nhập chỉ tạo được từ PO ở trạng thái `ORDERED/PARTIAL`; SKU phải có trong PO; tổng serial đã nhập theo SKU ≤ quantity đặt; serial không trùng.
3. Đơn hàng: trạng thái `PENDING → CONFIRMED → SHIPPING → COMPLETED`, `PENDING/CONFIRMED → CANCELLED`. Hủy → serial về `AVAILABLE`. Đơn đã `PAID` thì **không hủy được** (hoàn tiền nằm ngoài phạm vi).
4. Đơn STRIPE chưa thanh toán sau 30 phút → tự hủy, nhả serial (cron).
5. **Thời điểm thanh toán xong → phát hành hóa đơn + phiếu bảo hành** (cùng transaction, serial chuyển `SOLD`):
   - `STRIPE`: khi webhook `checkout.session.completed` hợp lệ.
   - `COD`: khi nhân viên chuyển đơn sang `COMPLETED` (đã thu tiền khi giao).
   - `POS / CASH`: ngay khi tạo đơn tại quầy.
6. Phát hành **idempotent**: mỗi đơn tối đa 1 hóa đơn (`invoices.order_id` unique), mỗi serial tối đa 1 phiếu bảo hành → Stripe gửi lại webhook không sinh hóa đơn trùng.
7. Chỉ tiếp nhận bảo hành khi phiếu `ACTIVE` và ngày tiếp nhận ≤ `end_date`; mỗi phiếu chỉ có 1 lần tiếp nhận đang mở (chưa có `returned_at`).

---

## 5. Task triển khai

> **Quy ước bắt buộc:**
>
> - Package manager là **yarn** (`yarn add`, `yarn remove`, `yarn <script>`); không dùng npm, không commit `package-lock.json`.
> - File cấu hình DB là `src/database/datasource.ts` (**không** đổi tên thành `data-source.ts`).
>
> Mỗi task kết thúc bằng: `yarn build` xanh + kiểm tra trên Swagger. Thứ tự là thứ tự phụ thuộc.

### P0 — Dọn dẹp & cho app boot được ✅ (2026-11-04)

| ID   | Task                                                                                                                                                                                                                                           | Kết quả / Done khi                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| P0.1 | Xóa `src/modules/v1/`, `src/shared/` (mail), `src/utils/map.ts` nếu không dùng, `app.controller/service` mẫu, `yarn-error.log`; giữ `yarn.lock`, **xóa `package-lock.json`**.                                                                  | Không còn import tới file đã xóa.                                |
| P0.2 | Gỡ deps thừa (`mssql`, `nodemailer`, `cache-manager*`, `ioredis`, `@types/axios`, `@types/cache-manager*`); thêm `@nestjs/schedule`, `dotenv` (khai báo tường minh), `joi` hoặc dùng class-validator cho env (qua `yarn remove` / `yarn add`). | `yarn install --frozen-lockfile` sạch.                           |
| P0.3 | Tạo `.env.example` (không có secret thật).                                                                                                                                                                                                     | Có đủ biến. **Giữ tên biến của `.env` hiện có**: `NESTJS_SERVER_PORT`, `PUBLIC_API_FRONTEND_URL`, `DB_*`, `JWT_SECRET_KEY`, `REFRESH_JWT_SECRET_KEY`, `JWT_*_EXPIRES_IN`, `STRIPE_*`. |

### P1 — Nền tảng (cross-cutting) ✅ (2026-11-04)

> Ghi chú khi làm: chưa sinh migration ở P1 vì entity sẽ đổi ở P2–P5 — migration khởi tạo sinh theo từng domain (P2.1…). DB dev hiện **đã có bảng và dữ liệu mẫu** (brands, suppliers…), nên trước khi chạy migration khởi tạo cần xóa schema cũ (D6). Module cũ được giữ lại nhưng đã chuyển sang guard/decorator mới; `POST /orders` tạm trả 501 tới P5.3; Stripe chưa đăng ký tới P5.4.

| ID   | Task                                                                                                                                                                                                                                    | Kết quả / Done khi                                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| P1.1 | `ConfigModule.forRoot({ isGlobal, validate })` + `config/env.validation.ts`; xóa toàn bộ `dotenv.config()` rải rác.                                                                                                                     | Thiếu biến env → app báo lỗi rõ khi boot.                                                      |
| P1.2 | `TypeOrmModule.forRootAsync` (`autoLoadEntities`); sửa `src/database/datasource.ts` (giữ tên) làm DataSource cho CLI; script `migration:generate/run/revert`, `seed` trong `package.json`.                                              | `yarn migration:run` chạy được trên DB trống.                                                  |
| P1.3 | `common/`: `BaseEntity`, pagination DTO, enums, decorators `@Public/@Roles/@Positions/@CurrentUser`.                                                                                                                                    | —                                                                                              |
| P1.4 | Lifecycle: `RequestIdMiddleware`, `LoggerMiddleware`, `AuthContextMiddleware` (đăng ký `forRoutes('{*splat}')` trong `AppModule`); `AuthGuard`, `RolesGuard` (APP_GUARD); `TransformInterceptor`; `AllExceptionsFilter`. Bỏ `LoggingInterceptor` vì `LoggerMiddleware` đã log method, status, thời gian, user và requestId cho mọi request (kể cả request bị guard chặn). | Route không `@Public` trả 401 khi thiếu token; sai role trả 403; mọi response cùng 1 envelope. |
| P1.5 | Swagger: CLI plugin `@nestjs/swagger` trong `nest-cli.json` (tự sinh schema DTO), `addBearerAuth`, `@ApiTags` mỗi controller, mount tại `/docs`.                                                                                        | Mở `/docs` thấy đủ nhóm API, nút Authorize hoạt động.                                          |

### P2 — Domain User & Auth ✅ (2026-11-04)

> Ghi chú khi làm:
>
> - Cấu trúc domain user: `modules/users/users.module.ts` + `modules/users/domain/{controllers,dto,entities,services}/` (tên file số ít: `user.*`, `position.*`, `employee.*`, `admin-user.controller.ts`); auth: `modules/auth/dto/`. Các domain sau (P3–P5) theo cùng mẫu này. Bỏ interface + token chuỗi; module khác dùng `UserService` / `EmployeeService` trực tiếp; tên class số ít khớp tên file.
> - Bỏ `GET /auth/me` vì trùng `GET /users/me` (hồ sơ nhân viên có kèm `employee.position`).
> - Refresh token: xoay vòng (mỗi token dùng 1 lần), lưu **SHA-256** (không dùng bcrypt vì bcrypt chỉ đọc 72 byte đầu của JWT), có `jti`; dùng lại token cũ → thu hồi phiên. Đổi mật khẩu / khóa tài khoản / nghỉ việc → thu hồi refresh token.
> - Migration: **giữ 1 file `InitSchema` duy nhất, sinh lại ở mỗi phase cho tới lần deploy đầu tiên** (chưa DB thật nào chạy nó). Sau khi deploy, mọi thay đổi schema phải là migration nối tiếp. Đã chạy thử migration + seed + 53 kịch bản API trên DB tạm.
> - DB dev hiện có (dữ liệu mẫu cũ) **chưa** được migrate — cần tạo DB trống mới hoặc xóa schema cũ rồi `yarn migration:run && yarn seed` (D6).
> - Seed admin đọc `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME` từ `.env`.

| ID   | Task                                                                                                                                                            | Kết quả / Done khi                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| P2.1 | Entity `users`, `positions`, `employees` theo mục 4; bỏ `sub_id`, `auth_method`, `avatar_url` bắt buộc.                                                         | Migration khởi tạo phần user.               |
| P2.2 | Auth: `POST /auth/register` (tạo CUSTOMER), `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`. bcrypt cho mật khẩu, refresh token lưu dạng hash.     | Đăng ký → đăng nhập → gọi API cần token OK. |
| P2.3 | Users: `GET/PATCH /users/me`, `PATCH /users/me/password`; admin: `GET /admin/users`, `PATCH /admin/users/:id/status`.                                           | —                                           |
| P2.4 | Positions CRUD (ADMIN); Employees: ADMIN tạo nhân viên = tạo user role STAFF + employee trong 1 transaction, đổi vị trí, nghỉ việc.                             | STAFF đăng nhập có `position` trong token.  |
| P2.5 | Seed: tài khoản ADMIN, 2 position SALES/WAREHOUSE.                                                                                                              | `yarn seed` idempotent.                     |

### P3 — Domain Product ✅ (2026-11-04)

> Ghi chú khi làm:
>
> - Cấu trúc: `modules/products/products.module.ts` + `{controllers,dto,entities,services}/` (không có cấp `domain/`) (1 module thay cho 3 sub-module brand/category/product). Controller brand/category gộp route public (`/brands`) và admin (`/admin/brands`); catalog admin ở `admin-product.controller.ts`.
> - Không có API xóa sản phẩm / SKU (đã gắn serial, đơn hàng) → ngừng bán bằng `isActive=false`. `skuCode` không sửa được.
> - Giá: ghi bằng `insert()` (không dùng `save()` vì `save()` sẽ UPDATE khi trùng PK); `beginAt` không được ở quá khứ; trùng `(sku, beginAt)` → 409.
> - Catalog list: 1 query SQL (LATERAL) tính giá hiện hành min/max + tồn kho + thumbnail cho cả trang, +1 query đếm; chi tiết: 3 query. `ProductsModule` export `ProductSkuService` (tồn kho) và `PriceService` (giá hiện hành) cho P5.
> - Làm sớm phần của phase sau: thêm cột `product_serials.status` + index `(product_sku_id, status)` (cần cho tồn kho); **xóa module cart** (P5.1) và `StripeService`/`StripeController` cũ chưa đăng ký (P5.4 viết lại).
> - Seed catalog mẫu: 4 thương hiệu, 3 danh mục, 4 sản phẩm / 5 SKU có giá. Đã chạy thử 65 kịch bản P3 + 53 kịch bản P2 trên DB tạm.

| ID   | Task                                                                                                                                                                            | Kết quả / Done khi                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| P3.1 | Brands, Categories CRUD (ADMIN), list/detail public.                                                                                                                            | —                                             |
| P3.2 | Products (SPU) + SKUs + `spu_sku_mapping`: tạo SPU kèm danh sách SKU trong 1 transaction; thêm/sửa/ẩn SKU.                                                                      | —                                             |
| P3.3 | Prices: `POST /admin/skus/:id/prices` (chỉ insert, `begin_at` mặc định now, cho phép đặt giá tương lai), `GET /admin/skus/:id/prices` (lịch sử). Không có endpoint sửa/xóa giá. | Đổi giá = tạo bản ghi mới; giá cũ còn nguyên. |
| P3.4 | Catalog public: `GET /products` (lọc brand/category/khoảng giá/từ khóa, phân trang, sort), `GET /products/:slug` (kèm SKU, giá hiện hành, **tồn kho tính từ serial**).          | Query giá hiện hành + tồn kho không N+1.      |

### P4 — Domain Inventory

| ID   | Task                                                                                                                                                                                                                                                            | Kết quả / Done khi                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| P4.1 | Suppliers CRUD (ADMIN, WAREHOUSE).                                                                                                                                                                                                                              | —                                                                       |
| P4.2 | Purchase orders: tạo `DRAFT` kèm chi tiết SKU/qty/unit_cost, sửa khi còn DRAFT, `confirm` → ORDERED, `cancel`.                                                                                                                                                  | —                                                                       |
| P4.3 | Warehouse receipts: `POST /admin/warehouse-receipts { purchaseOrderId, items:[{skuId, serials:[...]}] }` → 1 transaction tạo phiếu + N `product_serials` (AVAILABLE, unit_cost lấy từ PO), cập nhật trạng thái PO (PARTIAL/RECEIVED). Phiếu nhập **không sửa**. | Nhập 10 serial → tồn SKU tăng 10; vượt số đặt / trùng serial → 400/409. |
| P4.4 | Serials: tra cứu theo serial, lọc theo SKU/trạng thái; `GET /admin/inventory` tồn kho theo SKU.                                                                                                                                                                 | —                                                                       |

### P5 — Domain Order & Payment

| ID    | Task                                                                                                                                                                                                                                                                                                                                       | Kết quả / Done khi                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| P5.1  | **Bỏ module cart** (theo D1) — đã làm ở P3. Entity `orders`, `order_details`, `invoices`, `warranties`, `warranty_details` theo mục 4.                                                                                                                                                                                                                   | —                                                                                  |
| P5.2  | `POST /orders/preview` (public): nhận `items[{skuId, quantity}]`, trả giá hiện hành, tồn kho, tạm tính.                                                                                                                                                                                                                                    | —                                                                                  |
| P5.3  | `POST /orders` (CUSTOMER): transaction — lấy giá hiện hành, khóa & giữ serial FIFO (`FOR UPDATE SKIP LOCKED`), tạo order PENDING + order_details. Thiếu hàng → 409.                                                                                                                                                                        | Test đồng thời 2 request mua serial cuối: chỉ 1 thành công.                        |
| P5.4  | Stripe (code cũ đã xóa ở P3, viết mới): nếu `paymentMethod=STRIPE` tạo Checkout Session (metadata `orderId`), trả `checkoutUrl`. `POST /payments/stripe/webhook` (@Public, raw body, verify chữ ký) → `payment_status=PAID` → gọi `InvoiceService.issueForOrder` (P5.5).                                                                                                   | Dùng Stripe test mode + `stripe listen`; gửi lại webhook không sinh hóa đơn trùng. |
| P5.5  | **Phát hành hóa đơn + phiếu bảo hành**: `InvoiceService.issueForOrder(orderId, manager, issuedBy?)` chạy trong transaction của nơi gọi — tạo invoice (snapshot tiền, thuế, người mua), tạo 1 warranty / serial (`end_date = issued_at + warranty_months`), serial → `SOLD`. Bỏ qua nếu đơn đã có hóa đơn. Dùng chung cho Stripe, COD, POS. | Đơn 3 máy đã thanh toán → 1 hóa đơn + 3 phiếu bảo hành.                            |
| P5.6  | Đơn của khách: `GET /orders/me`, `GET /orders/me/:code`, `POST /orders/me/:code/cancel` (chỉ khi PENDING & UNPAID).                                                                                                                                                                                                                        | —                                                                                  |
| P5.7  | Admin (ADMIN, SALES): list/lọc đơn, chi tiết, `PATCH /admin/orders/:id/status` theo state machine; hủy → nhả serial; COD chuyển `COMPLETED` → `PAID` + phát hành hóa đơn/bảo hành (P5.5).                                                                                                                                                  | Chuyển trạng thái sai luật → 400.                                                  |
| P5.8  | Bán tại quầy: `POST /admin/orders` (SALES) với danh sách serial quét được, `channel=POS`, thanh toán CASH, hoàn tất ngay + phát hành hóa đơn/bảo hành (P5.5).                                                                                                                                                                              | Response trả kèm hóa đơn để in.                                                    |
| P5.9  | Cron (`@nestjs/schedule`): hủy đơn STRIPE `UNPAID` quá 30 phút; đánh dấu phiếu bảo hành quá `end_date` → `EXPIRED` (chạy hằng ngày).                                                                                                                                                                                                       | —                                                                                  |
| P5.10 | Invoices API: khách `GET /invoices/me`, `GET /invoices/me/:code`; admin (ADMIN, SALES) `GET /admin/invoices` (lọc theo ngày/khách/mã đơn), `GET /admin/invoices/:code`. Không có API sửa/xóa.                                                                                                                                              | Chi tiết hóa đơn kèm danh sách serial + phiếu bảo hành.                            |
| P5.11 | Warranties API: `GET /warranties/lookup/:serialNumber` (public — chỉ trả SKU, hạn, trạng thái, không lộ thông tin khách); khách `GET /warranties/me`; admin `GET /admin/warranties`, `GET /admin/warranties/:code`.                                                                                                                        | —                                                                                  |
| P5.12 | Tiếp nhận bảo hành (ADMIN, SALES): `POST /admin/warranties/:code/details` (nhận máy, ghi `before_status`), `PATCH /admin/warranties/:code/details/:receivedAt/return` (trả máy, ghi `after_status`).                                                                                                                                       | Phiếu hết hạn hoặc đang có lần tiếp nhận mở → 400.                                 |
| P5.13 | (Tối thiểu) `GET /admin/dashboard`: doanh thu theo ngày (tính từ `invoices`), số đơn theo trạng thái, SKU sắp hết hàng, số máy đang bảo hành.                                                                                                                                                                                              | —                                                                                  |

### P6 — Tài liệu, chất lượng, bàn giao

| ID   | Task                                                                                                                                                                                                                                            | Kết quả / Done khi                       |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| P6.1 | `docs/DESIGN.md`: mô tả dự án, yêu cầu chức năng / phi chức năng, công nghệ, kiến trúc & lifecycle, ERD (mermaid), API, phân quyền, luồng nghiệp vụ nhập kho, đặt hàng, thanh toán → hóa đơn → bảo hành. Gọn, ≤ ~400 dòng.                      | —                                        |
| P6.2 | `docs/API.md` (bảng endpoint × quyền) và `docs/BUSINESS_FLOWS.md` (sequence diagram mermaid nhập hàng / đặt hàng / Stripe → hóa đơn & bảo hành / tiếp nhận bảo hành) — nếu DESIGN.md quá dài thì tách ra.                                       | —                                        |
| P6.3 | Viết lại `README.md`: giới thiệu, tính năng, tech stack, cấu trúc thư mục, cài đặt, biến môi trường, migration/seed, chạy dev, Swagger URL, test Stripe webhook, script — **mọi lệnh viết bằng yarn**. Bỏ phần boilerplate NestJS.              | Người mới clone → chạy được theo README. |
| P6.4 | Test: unit test cho cấp serial FIFO, kiểm tra phiếu nhập vượt PO, giá hiện hành, state machine đơn, phát hành hóa đơn + bảo hành (đúng số phiếu, đúng hạn, idempotent); 1 e2e smoke: register → login → preview → order → thanh toán → hóa đơn. | `yarn test` xanh.                        |
| P6.5 | Lint/format toàn bộ, xóa `console.log`, `.vscode/launch.json` cập nhật nếu cần.                                                                                                                                                                 | `yarn lint` không lỗi.                   |

---

## 6. Danh sách API (dự kiến)

| Nhóm       | Endpoint                                                                                                      | Quyền                  |
| ---------- | ------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Auth       | `POST /auth/register` · `POST /auth/login` · `POST /auth/refresh`                                             | Public                 |
|            | `POST /auth/logout`                                                                                           | Đã đăng nhập           |
| Users      | `GET/PATCH /users/me` · `PATCH /users/me/password`                                                            | CUSTOMER/STAFF/ADMIN   |
|            | `GET /admin/users` · `PATCH /admin/users/:id/status`                                                          | ADMIN (SALES: chỉ xem) |
| Nhân sự    | `CRUD /admin/positions` · `CRUD /admin/employees`                                                             | ADMIN                  |
| Catalog    | `GET /brands` · `GET /categories` · `GET /products` · `GET /products/:slug`                                   | Public                 |
|            | `CRUD /admin/brands`, `/admin/categories`, `/admin/products` · `POST/PATCH /admin/products/:id/skus`          | ADMIN                  |
| Giá        | `POST /admin/skus/:id/prices` · `GET /admin/skus/:id/prices`                                                  | ADMIN                  |
| Kho        | `CRUD /admin/suppliers` · `/admin/purchase-orders` (+ `/confirm`, `/cancel`)                                  | ADMIN, WAREHOUSE       |
|            | `POST/GET /admin/warehouse-receipts` · `GET /admin/serials` · `GET /admin/inventory`                          | ADMIN, WAREHOUSE       |
| Đơn        | `POST /orders/preview`                                                                                        | Public                 |
|            | `POST /orders` · `GET /orders/me` · `GET /orders/me/:code` · `POST /orders/me/:code/cancel`                   | CUSTOMER               |
|            | `GET /admin/orders` · `GET /admin/orders/:id` · `PATCH /admin/orders/:id/status` · `POST /admin/orders` (POS) | ADMIN, SALES           |
| Thanh toán | `POST /payments/stripe/webhook`                                                                               | Public (verify chữ ký) |
| Hóa đơn    | `GET /invoices/me` · `GET /invoices/me/:code`                                                                 | CUSTOMER               |
|            | `GET /admin/invoices` · `GET /admin/invoices/:code`                                                           | ADMIN, SALES           |
| Bảo hành   | `GET /warranties/lookup/:serialNumber`                                                                        | Public                 |
|            | `GET /warranties/me`                                                                                          | CUSTOMER               |
|            | `GET /admin/warranties` · `GET /admin/warranties/:code`                                                       | ADMIN, SALES           |
|            | `POST /admin/warranties/:code/details` · `PATCH /admin/warranties/:code/details/:receivedAt/return`           | ADMIN, SALES           |
| Báo cáo    | `GET /admin/dashboard`                                                                                        | ADMIN                  |

---

## 7. Ngoài phạm vi (giai đoạn sau)

Mã giảm giá, đánh giá sản phẩm, upload ảnh (S3/MinIO), quên mật khẩu qua email, OAuth Google, nhiều kho, đổi trả/hoàn tiền Stripe (kèm hủy hóa đơn, `VOID` phiếu bảo hành), xuất hóa đơn PDF / hóa đơn điện tử, Redis cache.
