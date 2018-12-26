import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfoModel } from '../model/userinfo.model';
import { WebClientService } from './webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';
import { Converter } from '../framework/framework.converter';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserInfoUrl = 'user/get-info';
  private checkUserExistUrl = 'user/check-exist-user';
  private avatarUrl = 'user/avatar?';

  private userInfoSource = new BehaviorSubject<UserInfoModel>(new UserInfoModel());
  CurrentUserInfo = this.userInfoSource.asObservable();

  constructor(private webClient: WebClientService ) {}

  // ** get user info by token from api */
  fetchUserInfo() {
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getUserInfoUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
            const userInfo = new UserInfoModel();
            userInfo.AccountName = data.Result.accountname;
            userInfo.FullName = data.Result.fullname;
            userInfo.Email = data.Result.email;
            userInfo.PhoneNumber = data.Result.phonenumber;
            userInfo.Address = data.Result.address;
            userInfo.Address2 = data.Result.address2;
            userInfo.IdentityCard = data.Result.identitycard;
            userInfo.CreatedDate = new Date(data.Result.createddate);
            userInfo.JoinDate = Converter.convertDateToJoinDateString(userInfo.CreatedDate);

            if (userInfo.FullName === null || userInfo.FullName === '') {
              userInfo.FullName = userInfo.AccountName;
            }

            this.setCacheUserInfo(userInfo);
            this.userInfoSource.next(userInfo);
        }
    });
  }

  // **notify user info to view */
  displayUserInfo() {
    const userInfo = this.getUserInfoFromCache();
    this.userInfoSource.next(userInfo);
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

  // **check the existence of user */
  async isExist(accountName) {
    let result = false;
    const params = new Dictionary<string, any>();
    params.put('AccountName' , accountName);
    await this.webClient.doPost(AppSettings.API_ENDPOINT + this.checkUserExistUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = data.Result === 'true';
        }
    });
    return result;
  }

  getAvatarUrlByStaffId(staffId: string) {
    return AppSettings.API_ENDPOINT + this.avatarUrl + 'member=' + staffId + '&random=' + Math.random();
  }

  // **set user info to cache */
  private setCacheUserInfo(userInfo: UserInfoModel) {
    sessionStorage.setItem(AppSettings.MANAGE_USERINFO_KEY, JSON.stringify(userInfo));
  }
}
