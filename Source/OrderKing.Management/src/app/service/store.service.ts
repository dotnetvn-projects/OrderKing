import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserInfoModel } from '../model/userinfo.model';
import { WebClientService } from './webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private getStaffListUrl = 'store/get-member-list';
  private removeStaffUrl = 'store/remove-member';
  private createStaffUrl = 'store/add-member';
  private editStaffUrl = 'store/edit-member-info';
  private getStaffInfoUrl = 'store/get-member-info';
  private editStaffAvatarUrl = 'store/edit-member-avatar';
  private lockStaffUrl = 'store/lock-member';
  private unLockStaffUrl = 'store/unlock-member';

  private staffListSource = new BehaviorSubject<Array<UserInfoModel>>(new Array<UserInfoModel>());
  StaffList = this.staffListSource.asObservable();

  constructor(private webClient: WebClientService, private userService: UserService ) {}

   // ** get staffs list of current store */
   fetchStaffList(updateUI) {
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));

    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getStaffListUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<UserInfoModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const staffInfo = new UserInfoModel();
            staffInfo.UserId = e.memberid;
            staffInfo.StoreName = e.storename;
            staffInfo.AccountName = e.accountname;
            staffInfo.FullName = e.fullname;
            staffInfo.Email = e.email;
            staffInfo.PhoneNumber = e.phonenumber;
            staffInfo.Address = e.address;
            staffInfo.Address2 = e.address2;
            staffInfo.IdentityCard = e.identitycard;
            staffInfo.JoinDate = e.createddate;
            staffInfo.IsActived = e.isactived;
            staffInfo.Avatar = this.userService.getAvatarUrlByStaffId(staffInfo.UserId);
            if (staffInfo.FullName === null || staffInfo.FullName === '') {
              staffInfo.FullName = staffInfo.AccountName;
            }
            resultData.push(staffInfo);
           });
           this.staffListSource.next(resultData);
           if (updateUI !== null) {
             updateUI();
          }
        }
    });
  }

  // remove staff from store
  async removeStaff(staffId) {
    let result = AppSettings.RESPONSE_MESSAGE.SUCCESS;

    const params = new Dictionary<string, any>();
    params.put('MemberId' , staffId);
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.removeStaffUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else if (data.ResponseCode !== AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
    });

    return result;
  }

  // add new staff to store
  async addStaff(staff: UserInfoModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('AccountName' , staff.AccountName);
    params.put('Password' , staff.Password);
    params.put('FullName' , staff.FullName);
    params.put('Email' , staff.Email);
    params.put('PhoneNumber' , staff.PhoneNumber);
    params.put('Address' , staff.Address);
    params.put('Address2' , staff.Address2);
    params.put('IdentityCard' , staff.IdentityCard);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.createStaffUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = data.Result.staffid;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
    });

    return result;
  }

   // edit staff from store
   async editStaff(staff: UserInfoModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('MemberId' , staff.UserId);
    params.put('FullName' , staff.FullName);
    params.put('Email' , staff.Email);
    params.put('PhoneNumber' , staff.PhoneNumber);
    params.put('Address' , staff.Address);
    params.put('Address2' , staff.Address2);
    params.put('IdentityCard' , staff.IdentityCard);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.editStaffUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = data.Result.staffid;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
    });

    return result;
  }

  // update avatar
  async updateStaffAvatar(fileData: any, staffId: string) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('MemberId' , staffId);
    params.put('Avatar' , fileData);

    await this.webClient.doPostFileDataAsync(AppSettings.API_ENDPOINT + this.editStaffAvatarUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
    });

    return result;
  }

  // lock staff
  async lockStaff(staffId: string) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('MemberId' , staffId);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.lockStaffUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
    });

    return result;
  }

    // unlock staff
  async unLockStaff(staffId: string) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('MemberId' , staffId);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.unLockStaffUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
    });

    return result;
  }

  // get staff info by id
  async getStaffInfoById(id: string) {
    const info = {result: AppSettings.RESPONSE_MESSAGE.ERROR, staffInfo: null};

    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('MemberId' , id);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.getStaffInfoUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
           if (data.Result !== null) {
            info.result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
            info.staffInfo = new UserInfoModel();
            info.staffInfo.AccountName = data.Result.accountname;
            info.staffInfo.FullName = data.Result.fullname;
            if (data.Result.email !== 'null') {
             info.staffInfo.Email = data.Result.email;
            }
            info.staffInfo.PhoneNumber = data.Result.phonenumber;
            if (data.Result.address !== 'null') {
            info.staffInfo.Address = data.Result.address;
            }
            if (data.Result.address2 !== 'null') {
            info.staffInfo.Address2 = data.Result.address2;
            }
            if (data.Result.identitycard !== 'null') {
            info.staffInfo.IdentityCard = data.Result.identitycard;
            }
            info.staffInfo.JoinDate = data.Result.createddate;
            info.staffInfo.IsActived = data.Result.isactived;
           }
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          info.result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
        else {
          info.result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
    });

    return info;
  }
}
