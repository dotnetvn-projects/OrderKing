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
  private checkTokenUrl = 'auth/auth-token-status';

  constructor(private webClient: WebClientService ) {}

  // login
  async login(loginInfo: LoginModel) {
      let result = '';
      const params = new Dictionary<string, any>();
      params.put('AccountName' , loginInfo.AccountName);
      params.put('Password' , loginInfo.Password);
      await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.loginUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === 200) {
           result = data.Result.accesstoken;
           sessionStorage.setItem('order-king-token', result);
           if (loginInfo.RemeberMe) {
              localStorage.setItem('order-king-auth', loginInfo.AccountName + ':' + loginInfo.Password);
           }
        } else {
           if (data.ResponseCode === 401) {
             result = 'unauthorized';
           }
        }
      });
      return result;
  }

  // check token expiration
  async isTokenExpired(token: string) {
    let result = false;
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , token);
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.checkTokenUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode !== 200) {
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
