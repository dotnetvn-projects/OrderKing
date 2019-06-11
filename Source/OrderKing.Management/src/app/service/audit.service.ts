import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { AuditListModel } from '../model/audit/audit.list.model';
import { AuditModel } from '../model/audit/audit.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { AuditFilterModel } from '../model/audit/audit.filter.model';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private getAuditListUrl = 'audit/get-audit';
  private deleteAuditUrl = 'audit/delete-audit';

  private auditSource = new BehaviorSubject<AuditListModel>(new AuditListModel());
  auditData = this.auditSource.asObservable();

  constructor(private webClient: WebClientService) {}

  // ** get audit list */
  fetchAuditList(filter: AuditFilterModel, updateUI) {
    const params = new Dictionary<string, any>();
    params.put('StartDate', filter.FromDate);
    params.put('EndDate', filter.ToDate);
    params.put('PageSize', filter.PageSize);
    params.put('PageNumber', filter.PageNumber);
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getAuditListUrl, params, (data: ApiResultModel) => {
        const resultData = new AuditListModel();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          resultData.AuditItems = new Array<AuditModel>();
          data.Result.forEach(e => {
            const auditModel = new AuditModel();
            auditModel.Id = e.AuditId;
            auditModel.StaffName = e.StaffName;
            auditModel.AppName = e.AppName;
            auditModel.AuditContent = e.AuditContent;
            auditModel.CreatedDate = e.CreatedDate;
            resultData.AuditItems.push(auditModel);
            resultData.TotalRecord = e.TotalRecord;
           });
           this.auditSource.next(resultData);
           updateUI();
        }
    });
  }

    // ** delete audit */
  async removeAudit(auditId: string) {
    let result = AppSettings.RESPONSE_MESSAGE.SUCCESS;

    const params = new Dictionary<string, any>();
    params.put('AuditId', auditId);
    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.deleteAuditUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else if (data.ResponseCode !== AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
      }
    );

    return result;
  }


}
