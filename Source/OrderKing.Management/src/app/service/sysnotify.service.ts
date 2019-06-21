import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { SysNotifyModel } from '../model/sysnotify/sysnotify.model';
import { ListModel } from '../model/list.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { SysNotifyFilterModel } from '../model/sysnotify/sysnotify.filter.model';

@Injectable({
  providedIn: 'root'
})
export class SysNotifyService {
  private getNewNotifyListUrl = 'sysnotify/get-newest-notify-list';
  private getNotifyListUrl = 'sysnotify/get-notify-list';
  private getNotifyInfoUrl = 'sysnotify/get-notify-detail';


  private NewSysNotifyListSource = new BehaviorSubject<ListModel<SysNotifyModel>>(new ListModel<SysNotifyModel>());
  NewSysNotifyList = this.NewSysNotifyListSource.asObservable();

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
        const resultData = new ListModel<SysNotifyModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const sysNotify = new SysNotifyModel();
            sysNotify.Id = e.Id;
            sysNotify.Title = e.Title;
            sysNotify.Content = e.Content;
            sysNotify.UpdatedDate = e.UpdatedDate;
            resultData.TotalRecord = e.TotalRecord;
            resultData.Items.push(sysNotify);
          });
          this.NewSysNotifyListSource.next(resultData);
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


}
