export enum ErrorType {
  NOT_FOUND = 'Not Found!',
  PERMISSOIN_DENIED = 'Permission Denied!',
  // Add more error types here
  NO_SUCCESS = 'Thực hiện tác vụ không thành công.'
}

export enum ErrorInput {
  INPUT_INVALID = 'Nhập thông tin không hợp lệ.',
  NAME_INVALID = 'Tên không được chứa số hoặc khoảng trắng.',
  INPUT_WRONG_FORMAT = 'Nhập thông tin sai định dạng.',
  NOT_FULL_FIELD = 'Vui lòng không bỏ trống.',
  FIELD_MISSING = 'bạn nhập thiếu ',
  PHONE_NUMBER_ERROR = 'Số điện thoại phải có đúng 10 chữ số.',
  EMAIL_ERROR = 'Nhập Email chưa đúng.',
  PASSWORD_ERROR = 'Mật khẩu phải đủ 8 kí tự.',
  NUMBER_ERROR = 'Vui lòng không nhập số.',
  STRING_ERROR = 'Vui lòng không nhập text.',
  MAX_ERROR = 'Không nhập quá ',
  MIN_ERROR = 'Phải nhập đủ ',
  NOT_SELECT_FIELD = 'Vui lòng chọn ',
  PRICE_INVALID = 'Unit price must be less than price',
  EMAIL_EXSIT = 'Email đã tồn tại.',
  AuthExceptionMessages = 'AuthExceptionMessages.',
  EMAIL_NOT_FOUND = 'Không tìm thấy email.'
}

export enum SystemError {
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  CONNECT_ERROR = 'Kết nối thất bại.'
}

export enum DatabaseError {
  DUPLICATE = 'Dữ liệu đã tồn tại.',
  FOREIGN_KEY = 'Dữ liệu tham chiếu không tồn tại hoặc đang được sử dụng.',
  INVALID_INPUT = 'Dữ liệu đầu vào sai định dạng.'
}

export enum MiddlewareError {
  TOKEN_MISSING = 'Bạn cần đăng nhập để thực hiện thao tác này.',
  TOKEN_INVALID = 'Token không hợp lệ.',
  TOKEN_EXPIRED = 'Token đã hết hạn.'
}

export enum GuardError {
  // NOT_USER = 'Không thuộc quyền truy cập.',
  ACCESS_DENIED = 'Truy cập bị từ chối.'
}

export enum AuthError {
  INVALID_CREDENTIALS = 'Email hoặc mật khẩu không đúng.',
  ACCOUNT_NOT_ACTIVE = 'Tài khoản đã bị khóa hoặc ngừng hoạt động.',
  EMAIL_EXISTS = 'Email đã được sử dụng.',
  REFRESH_TOKEN_INVALID = 'Refresh token không hợp lệ hoặc đã bị thu hồi.',
  WRONG_PASSWORD = 'Mật khẩu hiện tại không đúng.'
}

export enum UserError {
  USER_NOT_FOUND = 'Không tìm thấy người dùng.',
  EMPLOYEE_NOT_FOUND = 'Không tìm thấy nhân viên.',
  POSITION_NOT_FOUND = 'Không tìm thấy vị trí.',
  NOT_ACTIVE_EMPLOYEE = 'Tài khoản không phải nhân viên đang làm việc.',
  CANNOT_CHANGE_OWN_STATUS = 'Không thể tự thay đổi trạng thái tài khoản của chính mình.',
  STAFF_STATUS_VIA_EMPLOYEE = 'Trạng thái tài khoản nhân viên được quản lý qua API nhân viên.'
}

export enum PipeError {
  VALIDATOR_MISSING = 'Dữ liệu thiếu.'
}

export enum ProductError {
  BRAND_NOT_FOUND = 'Không tìm thấy thương hiệu.',
  CATEGORY_NOT_FOUND = 'Không tìm thấy danh mục.',
  PRODUCT_NOT_FOUND = 'Không tìm thấy sản phẩm.',
  SKU_NOT_FOUND = 'Không tìm thấy SKU.',
  PRODUCT_INVENTORY_ERROR = 'Số lượng sản phẩm không đủ.',
  PRICE_IN_PAST = 'Thời điểm áp dụng giá không được ở quá khứ.',
  DISPLAY_PRICE_TOO_LOW = 'Giá niêm yết phải lớn hơn hoặc bằng giá bán.',
  PRICE_RANGE_INVALID = 'minPrice phải nhỏ hơn hoặc bằng maxPrice.'
}

export enum OrderError {
  CREATE_ORDER_ONLINE_ERROR = 'Tạo đơn hàng online thất bại.',
  CREATE_ORDER_OFFLINE_ERROR = 'Tạo đơn hàng offline thất bại.',
  ORDER_NOT_FOUND = 'Không tìm thấy đơn hàng theo yêu cầu.',
  CANCELED_ORDER_FAILED = 'Đơn hàng hủy thất bại.',
  COMPLETED_ORDER_FAILED = 'Đơn hàng đã hoàn thành không được thay đổi trạng thái.',
  CONFIRMED_ORDER_FAILED = '',
  NOT_YET_CONFIRM = 'Đơn hàng chưa được duyệt.',
  CANCELED_ORDER = 'Đơn hàng không được hủy.',
  UPDATE_STATUS_ORDER_FAILED = 'Cập nhật trạng thái thất bại.'
}

export enum OrderDetailError {
  TOTAL_PRICE_FAILED = 'Tính tiền thất bại.'
}

export enum StripeError {
  CHECKOUT = 'Checkout failed.',
  WEBHOOK = 'webhook failed.'
}

// export enum
