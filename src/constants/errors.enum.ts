export enum ErrorType {
  NOT_FOUND = 'Not Found!',
  PERMISSOIN_DENIED = 'Permission Denied!',
  // Add more error types here
  NO_SUCCESS = 'Thực hiện tác vụ không thành công.',
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
  EMAIL_NOT_FOUND = 'Không tìm thấy email.',
}

export enum SystemError {
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  CONNECT_ERROR = 'Kết nối thất bại.',
}

export enum MiddlewareError {
  TOKEN_MISSING = 'Bạn thiếu token.',
  TOKEN_INVALID = 'Token của bạn hết hạn khoặc không hợp lệ.',
}

export enum GuardError {
  NOT_ADMIN = 'Bạn không phải là Admin.',
  NOT_USER = 'Bạn không phải là User.',
  ACCESS_DENIED = 'Truy cập bị từ chối.',
}

export enum PipeError {
  VALIDATOR_MISSING = 'Dữ liệu thiếu.',
}

export enum ProductError {
  CREATE_PRODUCT_ERROR = 'Đã xảy ra lỗi khi tạo một sản phẩm.',
  PRODUCT_INVENTORY_ERROR = 'Số lượng sản phẩm không đủ.',
  PRODUCT_ID_NOT_EXIST = 'Mã sản phẩm không tồn tại.',
  FILTER_PRODUCT_ERROR = 'không lọc được sản phẩm phù hợp.',
    PRODUCT_DUPLICATE = "Model Sản phẩm đã tồn tại.",

}

export enum ImageError {
  CREATE_IMAGE_ERROR = 'Đã xảy ra lỗi khi lưu hình ảnh.',
}

export enum OrderError {
  CREATE_ORDER_ONLINE_ERROR = 'Tạo đơn hàng online thất bại.',
  CREATE_ORDER_OFFLINE_ERROR = 'Tạo đơn hàng offline thất bại.',
  ORDER_NOT_FOUND = 'Không tìm thấy đơn hàng theo yêu cầu.',
  CANCELED_ORDER_FAILED = 'Đơn hàng không được hủy.',
  COMPLETED_ORDER_FAILED = 'Đơn hàng đã hoàn thành không được thay đổi trạng thái.',
  CONFIRMED_ORDER_FAILED = '',
  NOT_YET_CONFIRM = 'Đơn hàng chưa được duyệt.',
  CANCELED_ORDER = 'Đơn hàng không được hủy.',
  UPDATE_STATUS_ORDER_FAILED = 'Cập nhật trạng thái thất bại.',
}

export enum OrderDetailError {
  TOTAL_PRICE_FAILED = 'Tính tiền thất bại.',
}

export enum StripeError {
  CHECKOUT = '',
  WEBHOOK = '',
}


// export enum 