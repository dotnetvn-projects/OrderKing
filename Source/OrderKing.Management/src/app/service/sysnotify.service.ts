import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { SysNotifyModel } from '../model/sysnotify/sysnotify.model';
import { ListModel } from '../model/list.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { SysNotifyFilterModel } from '../model/sysnotify/sysnotify.filter.model';
import { SysNotifyGroupModel } from '../model/sysnotify/sysnotify.group.model';

@Injectable({
  providedIn: 'root'
})
export class SysNotifyService {
  private getNewNotifyListUrl = 'sysnotify/get-newest-notify-list';
  private getNotifyListUrl = 'sysnotify/get-notify-list';
  private getNotifyInfoUrl = 'sysnotify/get-notify-detail';
  private updateHasReadUrl = 'sysnotify/update-notify-hasread-single-account';


  private NewSysNotifyListSource = new BehaviorSubject<ListModel<SysNotifyModel>>(new ListModel<SysNotifyModel>());
  NewSysNotifyList = this.NewSysNotifyListSource.asObservable();

  private SysNotifyListSource = new BehaviorSubject<ListModel<SysNotifyGroupModel>>(new ListModel<SysNotifyGroupModel>());
  SysNotifyList = this.SysNotifyListSource.asObservable();

  constructor(private webClient: WebClientService) {}

  // ** get new sysnotify list from system */
  fetchNewSysNotifyList() {
    const params = new Dictionary<string, any>();
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getNewNotifyListUrl, params, (data: ApiResultModel) => {
        const resultData = new ListModel<SysNotifyModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const sysNotify = new SysNotifyModel();
            sysNotify.Id = e.Id;
            sysNotify.Title = e.Title;
            sysNotify.Content = e.Content;
            sysNotify.UpdatedDate = e.UpdatedDate;
            resultData.Items.push(sysNotify);
          });
          this.NewSysNotifyListSource.next(resultData);
        }
      }
    );
  }
  // ** get sysnotify list from system */
  fetchSysNotifyList(filter: SysNotifyFilterModel, updateUI) {
    const params = new Dictionary<string, any>();
    params.put('PageSize', filter.PageSize);
    params.put('PageNumber', filter.PageNumber);

    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getNotifyListUrl, params, (data: ApiResultModel) => {
      const resultData = new ListModel<SysNotifyGroupModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            let sysNotifyGroup = new SysNotifyGroupModel();

            const itemIndex = resultData.Items.findIndex(c => c.DateGroup === e.DateGroup);

            const sysNotify = new SysNotifyModel();
            sysNotify.Id = e.Id;
            sysNotify.Title = e.Title;
            sysNotify.Content = e.Content;
            sysNotify.UpdatedDate = e.UpdatedDate;
            sysNotify.DateGroup = e.DateGroup;
            resultData.TotalRecord = e.TotalRecord;

            if (itemIndex < 0) {
              sysNotifyGroup.DateGroup = e.DateGroup;
              sysNotifyGroup.SysNotifyList = new Array<SysNotifyModel>();
              resultData.Items.push(sysNotifyGroup);
            } else {
              sysNotifyGroup = resultData.Items[itemIndex];
            }
            sysNotifyGroup.SysNotifyList.push(sysNotify);
          });

          this.SysNotifyListSource.next(resultData);
          updateUI();
        }
      }
    );
  }

  // get sys notify info by id
  async getSysNotifyInfoById(id: string) {
    const info = { result: AppSettings.RESPONSE_MESSAGE.ERROR, sysNotifyInfo: null };
    const params = new Dictionary<string, any>();
    params.put('Id', id);

    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.getNotifyInfoUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          if (data.Result !== null) {
            info.result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
            info.sysNotifyInfo = new SysNotifyModel();
            info.sysNotifyInfo.Id = data.Result.Id;
            info.sysNotifyInfo.Title = data.Result.Title;
            info.sysNotifyInfo.Content = data.Result.Content;
            info.sysNotifyInfo.UpdatedDate = data.Result.UpdatedDate;
          }
        } else if (
          data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED
        ) {
          info.result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else {
          info.result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
      }
    );

    return info;
  }


  // ** update all notify status */
   updateHasRead() {
    const params = new Dictionary<string, any>();
    params.put('HasRead', 1);
     this.webClient.doPost(AppSettings.API_ENDPOINT + this.updateHasReadUrl, params, (data: ApiResultModel) => {
       const result = data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS;
       if (result) {
        this.fetchNewSysNotifyList();
       }
    });
  }
}
