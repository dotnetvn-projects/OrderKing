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

  /** get access token */
  public static accessToken() {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
}
