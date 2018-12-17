import { Injectable } from '@angular/core';
import { LoginModel } from '../model/login.model';
import { WebClientService } from '../service/webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'auth/auth-user';
  private logoutUrl = 'auth/remove-auth';
  private checkTokenUrl = 'auth/auth-token-status';

  constructor(private webClient: WebClientService ) {}

  // login
  async login(loginInfo: LoginModel) {
      let result = '';
      const params = new Dictionary<string, any>();
      params.put('AccountName' , loginInfo.AccountName);
      params.put('Password' , loginInfo.Password);
      await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.loginUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
           result = data.Result.accesstoken;
           sessionStorage.setItem(AppSettings.TOKEN_KEY, result);
           if (loginInfo.RemeberMe) {
              localStorage.setItem(AppSettings.AUTH_KEY, loginInfo.AccountName + ':' + loginInfo.Password);
           }
        } else {
           if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
             result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
           }
        }
      });
      return result;
  }

  async logout() {
    let result = '';
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.logoutUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          this.clearLoginSession();
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
      } else {
            result = AppSettings.RESPONSE_MESSAGE.ERROR;
          }
    });
    return result;
  }

  // ** clear current login session */
  clearLoginSession() {
    sessionStorage.removeItem(AppSettings.TOKEN_KEY);
    localStorage.removeItem(AppSettings.AUTH_KEY);
    sessionStorage.removeItem(AppSettings.MANAGE_USERINFO_KEY);
  }

  // check token expiration
  async isTokenExpired() {
    let result = false;
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.checkTokenUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode !== AppSettings.RESPONSE_CODE.SUCCESS) {
          result = true;
      } else {
          const isExpired = data.Result.isexpired;
          if (isExpired === 'true') {
            return true;
          }
      }
    });
    return result;
  }

}
