import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfoModel } from '../model/user/userinfo.model';
import { WebClientService } from './webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';
import { Converter } from '../framework/framework.converter';
import { PasswordInfoModel } from '../model/user/passwordInfo.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserInfoUrl = 'user/get-info';
  private checkUserExistUrl = 'user/check-exist-account';
  private avatarUrl = 'user/user-avatar?';
  private editInfoUrl = 'user/edit-info';
  private editAvatarUrl = 'user/change-avatar';
  private changePassUrl = 'user/change-pass';
  private comparePassUrl = 'user/compare-password';
  private checkEmailUrl = 'user/check-exist-email';
  private checkPhoneUrl = 'user/check-exist-phone';
  private checkIdentittyCardUrl = 'user/check-exist-identitycard';

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
            userInfo.Avatar = this.getCurrentAvatarUrl();
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

  // **check the existence of accountName */
  async isExistAccountName(accountName) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;
    const params = new Dictionary<string, any>();
    params.put('AccountName' , accountName);
    await this.webClient.doPost(AppSettings.API_ENDPOINT + this.checkUserExistUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        }
    });
    return result;
  }

  getAvatarUrlByStaffId(staffId: string) {
    return AppSettings.API_ENDPOINT + this.avatarUrl + 'member=' + staffId + '&random=' + Math.random();
  }

  getCurrentAvatarUrl() {
    return AppSettings.API_ENDPOINT + this.avatarUrl + 'access_token='
          + sessionStorage.getItem(AppSettings.TOKEN_KEY) + '&random=' + Math.random();
  }

// edit user info
async editUserInfo(info: UserInfoModel) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('FullName' , info.FullName);
  params.put('Email' , info.Email);
  params.put('PhoneNumber' , info.PhoneNumber);
  params.put('Address' , info.Address);
  params.put('Address2' , info.Address2);
  params.put('IdentityCard' , info.IdentityCard);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.editInfoUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result = data.Result.fullname;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
  });

  return result;
}

 // update avatar
 async updateAvatar(fileData: any) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('Avatar' , fileData);

  await this.webClient.doPostFileDataAsync(AppSettings.API_ENDPOINT + this.editAvatarUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
  });

  return result;
}

// change password
async changePassword(info: PasswordInfoModel) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('Password' , info.NewPassword);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.changePassUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result =  AppSettings.RESPONSE_MESSAGE.SUCCESS;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
  });

  return result;
}

// compare client password and server password
async isSameServerPass(info: PasswordInfoModel) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('Password' , info.Password);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.comparePassUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result =  AppSettings.RESPONSE_MESSAGE.SUCCESS;
      }
  });

  return result;
}

// check the existence of email
async isExistEmail(email) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('Email' , email);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.checkEmailUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result =  AppSettings.RESPONSE_MESSAGE.SUCCESS;
      }
  });

  return result;
}

// check the existence of phone number
async isExistPhoneNumber(phonenumber) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('PhoneNumber' , phonenumber);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.checkPhoneUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result =  AppSettings.RESPONSE_MESSAGE.SUCCESS;
      }
  });

  return result;
}

// check the existence of identity card
async isExistIdentityCard(identitycard) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('IdentityCard' , identitycard);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.checkIdentittyCardUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result =  AppSettings.RESPONSE_MESSAGE.SUCCESS;
      }
  });

  return result;
}



// check user info has valid or not
async checkValidUserInfo(info: UserInfoModel) {
  let result = AppSettings.RESPONSE_MESSAGE.ERROR;

  const params = new Dictionary<string, any>();
  params.put('Phone' , info.PhoneNumber);
  params.put('Email' , info.Email);
  params.put('IdentityCard' , info.IdentityCard);

  await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.comparePassUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result =  AppSettings.RESPONSE_MESSAGE.SUCCESS;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
  });

  return result;
}

  // **set user info to cache */
  private setCacheUserInfo(userInfo: UserInfoModel) {
    sessionStorage.setItem(AppSettings.MANAGE_USERINFO_KEY, JSON.stringify(userInfo));
  }
}
