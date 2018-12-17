import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserInfoModel } from '../model/userinfo.model';
import { WebClientService } from './webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private getStaffListUrl = 'store/get-member-list';
  private removeStaffUrl = 'store/remove-member';
  private createStaffUrl = 'store/add-member';

  private staffListSource = new BehaviorSubject<Array<UserInfoModel>>(new Array<UserInfoModel>());
  StaffList = this.staffListSource.asObservable();

  constructor(private webClient: WebClientService ) {}

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
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    params.put('MemberId' , staffId);
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.removeStaffUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode !== AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
    });

    return result;
  }

  // remove member from store
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
        }
    });

    return result;
  }
}