import { Component, Injector, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { AuditFilterModel } from 'src/app/model/audit/audit.filter.model';
import { AuditListModel } from 'src/app/model/audit/audit.list.model';
import { AuditService } from 'src/app/service/audit.service';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { PaginationComponent } from 'src/app/presentation/_uicomponents/pagination/pagination.component';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.view.html',
  styleUrls: ['./audit.style.scss']
})
export class AuditComponent extends BaseComponent {

  AuditFilter: AuditFilterModel = new AuditFilterModel();
  AuditList: AuditListModel = new AuditListModel();

  @ViewChild('AuditPagerContainer', { read: ViewContainerRef }) saleReportViewContainerRef: ViewContainerRef;
  private auditPagerComponent: any;

  constructor(private titleService: Title,
    private auditService: AuditService,
    private componentFactoryResolver: ComponentFactoryResolver,
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
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.AUDIT_LOG);
    this.subscribeObject();
    this.loadAuditList();
  }

  // load all top report
  loadAuditList() {
    this.auditService.fetchAuditList(this.AuditFilter, () => {
      this.loadAuditPager();
    });
  }

  deleteAudit(id: string) {
    this.dialogService.showConfirm(AppMessage.APP_DIALOG_TITLE.CONFIRM, AppMessage.APP_DIALOG_MESSAGE.DELETE_AUDIT, async () => {
      const result = await this.auditService.removeAudit(id);
      if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.DELETE_AUDIT, () => {
          this.loadAuditList();
        });
      } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        });
      } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
      }
    });
  }

  // load audit pager
  private loadAuditPager() {
    // load pager dynamic
    if (this.auditPagerComponent == null) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
      this.auditPagerComponent = this.saleReportViewContainerRef.createComponent(factory);
      this.auditPagerComponent.instance.PageChange.subscribe((event) => {
        this.AuditFilter.PageNumber = event;
        this.loadAuditList();
      });
    }

    this.auditPagerComponent.instance.Css = 'pagination no-margin pull-right';
    this.auditPagerComponent.instance.PageSize = this.AuditFilter.PageSize;
    this.auditPagerComponent.instance.TotalPage = this.AuditList.TotalRecord;
    this.auditPagerComponent.changeDetectorRef.detectChanges();
  }
}
