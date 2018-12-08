import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfoModel } from '../model/userinfo.model';
import { WebClientService } from '../service/webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';
import { Converter } from '../framework/framework.converter';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserInfoUrl = 'user/get-info';

  private UserInfoSource = new BehaviorSubject<UserInfoModel>(new UserInfoModel());
  CurrentUserInfo = this.UserInfoSource.asObservable();

  constructor(private webClient: WebClientService ) {}

  // ** get user info by token from api */
  getUserInfo(accesstoken: string) {
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , accesstoken);
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getUserInfoUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === 200) {
            const info = new UserInfoModel();
            info.AccountName = data.Result.accountname;
            info.FullName = data.Result.fullname;
            info.Email = data.Result.email;
            info.PhoneNumber = data.Result.phonenumber;
            info.Address = data.Result.address;
            info.Address2 = data.Result.address2;
            info.IdentityCard = data.Result.identitycard;
            info.CreatedDate = new Date(data.Result.createddate);
            info.JoinDate = Converter.convertDateToJoinDateString(info.CreatedDate);

            if (info.FullName === null || info.FullName === '') {
                info.FullName = info.AccountName;
            }

            this.setCacheUserInfo(info);
        }
    });
  }

  // **notify user info to view */
  displayUserInfo() {
    const userInfo = this.getUserInfoFromCache();
    this.UserInfoSource.next(userInfo);
  }

  // **get user info from session storage */
  getUserInfoFromCache() {
    const data = sessionStorage.getItem(AppSettings.MANAGE_USERINFO_KEY);
    let userInfo = <UserInfoModel>JSON.parse(data);
    if (userInfo === null) {
      userInfo = new UserInfoModel();
    }
    return userInfo;
  }

  private setCacheUserInfo(userInfo: UserInfoModel) {
    sessionStorage.setItem(AppSettings.MANAGE_USERINFO_KEY, JSON.stringify(userInfo));
  }
}
