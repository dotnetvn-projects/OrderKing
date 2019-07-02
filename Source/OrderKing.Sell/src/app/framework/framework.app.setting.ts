import { HttpHeaders, HttpParams } from '@angular/common/http';

export class  AppSettings {

  // config api
   public static API_ENDPOINT = 'http://localhost:1337/api/public/';
  // public static API_ENDPOINT = 'https://orderkingserverapi.azurewebsites.net/api/public/';
  public static TOKEN_KEY = 'order-king-token-seller';
  public static AUTH_KEY = 'order-king-auth-seller';
  public static MANAGE_USERINFO_KEY = 'order-king-seller-userinfo';
  public static USERINFO_FLAG = 'order-king-user-info-flag';

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

  public static SALE_TRENDING = {
    UP: 0,
    DOWN: 1,
    SAME: 2
  };

  // default image
  public static APP_DEFAULT_IMAGE = {
    DEFAULT_AVATAR: '../../../../assets/images/no-avatar.png',
    DEFAULT_PRODUCT: '../../../../assets/images/default-product.png',
    NO_IMAGE: '../../../../assets/images/no-image.png'
  };

  /** create default http params */
  public static createDefaultHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('appname', 'http://seller.orderking.com');
    headers = headers.set('apikey', '867b1ec2262fcc9ebe11e6f0d1c2d76c' );
    return headers;
  }

  /** create http params  */
  public static createDefaultHttpParams() {
    let params = new HttpParams();
    params = params.set('AccessToken' , this.accessToken());
    return params;
  }

  // ** create formdata */
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
