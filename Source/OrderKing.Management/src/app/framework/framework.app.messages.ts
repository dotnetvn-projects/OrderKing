export class AppMessage {
  // error message
  public static APP_ERROR_MESSAGE = {
    BUSY: 'Hệ thống đang bận không thể xử lý, vui lòng thử lại !',
    SESSION_TIMEOUT: 'Phiên làm việc đã kết thức, vui lòng đăng nhập lại !',
    SELECT_CATEGORY: 'Vui lòng chọn danh mục !'
  };

  // success message
  public static APP_SUCCESS_MESSAGE = {
    CREATE_STAFF: 'Tạo mới nhân viên thành công !',
    UPDATE_STAFF: 'Cập nhật thông tin nhân viên thành công !',
    DELETE_STAFF: 'Xóa nhân viên thành công !',
    CREATE_CATEGORY: 'Tạo mới danh mục thành công !',
    UPDATE_CATEGORY: 'Cập nhật thông tin danh mục thành công !',
    DELETE_CATEGORY: 'Xóa danh mục thành công !',
    CREATE_PRODUCT: 'Tạo mới mặt hàng thành công !',
    UPDATE_PRODUCT: 'Cập nhật thông tin mặt hàng thành công !',
    DELETE_PRODUCT: 'Xóa mặt hàng thành công',
    UPDATE_STORE: 'Cập nhật thông tin cửa hàng thành công',
    UPDATE_ORDER: 'Cập nhật thông tin đơn hàng thành công'
  };

  // title message
  public static APP_TITLE_MESSAGE = {
    LOGIN: 'Order King - Đăng nhập hệ thống',
    STAFF: 'Order King - Danh sách nhân viên',
    STAFF_CREATE: 'Order King - Tạo mới nhân viên',
    STAFF_UPDATE: 'Order King - Chỉnh sửa thông tin nhân viên',
    CATEGORY: 'Order King - Danh mục',
    CATEGORY_CREATE: 'Order King - Tạo mới danh mục',
    CATEGORY_UPDATE: 'Order King - Chỉnh sửa thông tin danh mục',
    PRODUCT: 'Order King - Danh sách mặt hàng',
    PRODUCT_CREATE: 'Order King - Tạo mới mặt hàng',
    PRODUCT_UPDATE: 'Order King - Chỉnh sửa thông tin mặt hàng',
    STORE: 'Order King - Thông tin cửa hàng',
    STORE_UPDATE: 'Order King - Chỉnh sửa thông tin cửa hàng',
    ORDER: 'Order King - Danh sách đơn hàng',
    ORDER_DETAIL: 'Order King - Chi tiết đơn hàng',
    ORDER_PRINT: 'Đơn hàng - '
  };

  // Control content
  public static APP_CONTROL_CONTENT = {
    CREATE: 'Tạo mới',
    UPDATE: 'Chỉnh sửa'
  };

  // Dialog Title
  public static APP_DIALOG_TITLE = {
    CONFIRM: 'Xác nhận',
  };

  // Dialog message
  public static APP_DIALOG_MESSAGE = {
    DELETE_STAFF: 'Bạn có chắc muốn xóa nhân viên này?',
    DELETE_CATEGORY: 'Bạn có chắc muốn xóa danh mục này?',
    DELETE_PRODUCT: 'Bạn có chắc muốn xóa mặt hàng này?'
  };
}
