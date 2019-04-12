import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { DialogService } from 'src/app/service/dialog.service';
import { ReportService } from 'src/app/service/report.service';
import { RevenueReportModel } from 'src/app/model/report/revenue.report.model';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { SaleReportModel } from 'src/app/model/report/sale.report.model';
import { ReportFilterModel } from 'src/app/model/report/report.filter.model';


@Component({
  selector: 'app-report-revenue',
  templateUrl: './report.revenue.view.html',
  styleUrls: ['./report.revenue.style.scss']
})

export class ReportRevenueComponent extends BaseComponent {
  RevenueReport: RevenueReportModel = new RevenueReportModel();
  SaleReportList: SaleReportModel[];
  ReportFilter: ReportFilterModel = new ReportFilterModel();

  constructor(
    private titleService: Title,
    private dialogService: DialogService,
    private reportService: ReportService,
    injector: Injector) {
    super(injector);

  }

  // subscribe object from service
  subscribeObject() {
    this.reportService.RevenueReport.subscribe(data => this.RevenueReport = data);
    this.reportService.SaleReportList.subscribe(data => this.SaleReportList = data);
  }

  // init component
  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.REPORT_REVENUE);
    this.subscribeObject();
    this.loadRevenueReport();
    this.loadSaleReport();
  }

  // load revenue report
  loadRevenueReport() {
     this.reportService.loadRevenueReport();
  }

  // load sale report
  loadSaleReport() {
    this.reportService.loadSaleReport(this.ReportFilter, null);
 }
}
