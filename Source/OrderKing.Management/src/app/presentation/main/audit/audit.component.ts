import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { AuditFilterModel } from 'src/app/model/audit/audit.filter.model';
import { AuditListModel } from 'src/app/model/audit/audit.list.model';
import { AuditService } from 'src/app/service/audit.service';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.view.html',
  styleUrls: ['./audit.style.scss']
})
export class AuditComponent extends BaseComponent {

  AuditFilter: AuditFilterModel = new AuditFilterModel();
  AuditList: AuditListModel = new AuditListModel();

  constructor(private titleService: Title,
    private auditService: AuditService,
    private dialogService: DialogService,
    private router: Router,
     injector: Injector) {
    super(injector);
 }
 // subscribe object from service
 subscribeObject() {
  this.auditService.auditData.subscribe(data => this.AuditList = data);
}

// init component
onInit() {
  this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.REPORT_REVENUE);
  this.subscribeObject();
  this.loadAuditList();
}

// load all top report
loadAuditList() {
  this.auditService.fetchAuditList(this.AuditFilter);
}

}
