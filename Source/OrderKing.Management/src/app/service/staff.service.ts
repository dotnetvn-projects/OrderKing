import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserInfoModel } from '../model/userinfo.model';
import { WebClientService } from './webclient.service';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { AppSettings } from '../framework/framework.app.setting';
import { Converter } from '../framework/framework.converter';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private getStaffListUrl = 'store/get-member-list';

  StaffList = new Observable<Array<UserInfoModel>>();

  constructor(private webClient: WebClientService ) {}

   // ** get staffs list of current store */
   fetchStaffList() {
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getStaffListUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<UserInfoModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const staffInfo = new UserInfoModel();
            staffInfo.StoreName = e.storename;
            staffInfo.AccountName = e.accountname;
            staffInfo.FullName = e.fullname;
            staffInfo.Email = e.email;
            staffInfo.PhoneNumber = e.phonenumber;
            staffInfo.Address = e.address;
            staffInfo.Address2 = e.address2;
            staffInfo.IdentityCard = e.identitycard;
            staffInfo.CreatedDate = new Date(e.createddate);
            staffInfo.JoinDate = Converter.convertDateToJoinDateString(staffInfo.CreatedDate);

            if (staffInfo.FullName === null || staffInfo.FullName === '') {
              staffInfo.FullName = staffInfo.AccountName;
            }
            resultData.push(staffInfo);
           });

           this.StaffList = of(resultData);
        }
    });
  }
}
