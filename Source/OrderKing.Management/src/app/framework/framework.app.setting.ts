import { HttpHeaders, HttpParams } from '@angular/common/http';

export class  AppSettings {

  // config api
  public static API_ENDPOINT = 'http://localhost:1337/api/public/';
  public static TOKEN_KEY = 'order-king-token';
  public static AUTH_KEY = 'order-king-auth';
  public static MANAGE_USERINFO_KEY = 'order-king-manage-userinfo';

  // response message
  public static RESPONSE_MESSAGE = {
    ERROR : 'error',
    SUCCESS: 'ok',
    UNAUTHORIZED: 'unauthorized'
  };

  // response code
  public static RESPONSE_CODE = {
    SUCCESS: 200,
    UNAUTHORIZED: 401
  };

    // error message
    public static APP_ERROR_MESSAGE = {
      BUSY : 'Hệ thống đang bận không thể xử lý, vui lòng thử lại !',
      SESSION_TIMEOUT: 'Phiên làm việc đã kết thức, vui lòng đăng nhập lại !'
    };

    // success message
    public static APP_SUCCESS_MESSAGE = {
      CREATE_STAFF : 'Tạo mới nhân viên thành công !',
      UPDATE_STAFF: 'Cập nhật thông tin nhân viên thành công !',
      DELETE_STAFF: 'Xóa nhân viên thành công !',
      CREATE_CATEGORY : 'Tạo mới danh mục thành công !',
      UPDATE_CATEGORY: 'Cập nhật thông tin danh mục thành công !',
      DELETE_CATEGORY: 'Xóa danh mục thành công !'
    };

     // title message
     public static APP_TITLE_MESSAGE = {
      LOGIN: 'Order King - Đăng nhập hệ thống',
      STAFF : 'Order King - Danh sách nhân viên',
      STAFF_CREATE: 'Order King - Tạo mới nhân viên',
      STAFF_UPDATE: 'Order King - Chỉnh sửa thông tin nhân viên',
      CATEGORY: 'Order King - Danh mục',
      CATEGORY_CREATE: 'Order King - Tạo mới danh mục',
      CATEGORY_UPDATE: 'Order King - Chỉnh sửa danh mục'
    };

    // Control content
    public static APP_CONTROL_CONTENT = {
      CREATE: 'Tạo mới',
      UPDATE: 'Chỉnh sửa'
    };

    // default image
    public static APP_DEFAULT_IMAGE = {
      DEFAULT_AVATAR: '../../../../assets/images/no-avatar.png',
      NO_IMAGE: '../../../../assets/images/no-image.png'
    };

  /** create default http params */
  public static createDefaultHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('appname', 'http://manage.orderking.com');
    headers = headers.set('apikey', '0daeb74c82c8f2287038959ce8697896' );
    return headers;
  }

  /** create http params  */
  public static createDefaultHttpParams() {
    let params = new HttpParams();
    params = params.set('AccessToken' , this.accessToken());
    return params;
  }

  public static createDefaultFormData() {
    const data = new FormData();
    data.append('AccessToken', this.accessToken());
    return data;
  }

  /** get access token */
  public static accessToken() {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
}
