import { Injectable } from '@angular/core';
import { LoginModel } from '../model/login.model';
import { WebClientService } from '../service/webclient.service';
import { Dictionary } from '../framework/objectextension/dictionary';
import { ApiResultModel } from '../model/api.result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:1337/api/public/auth/auth-user';

  constructor(private webClient: WebClientService ) {}

  // login
  async Login(loginInfo: LoginModel) {
      let result = '';
      const params = new Dictionary<string, any>();
      params.put('AccountName' , loginInfo.AccountName);
      params.put('Password' , loginInfo.Password);
      await this.webClient.doPostAsync(this.loginUrl, params, (data: ApiResultModel) => {
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
}
