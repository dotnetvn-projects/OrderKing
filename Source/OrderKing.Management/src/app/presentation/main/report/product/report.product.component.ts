import { Component, Injector, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { DialogService } from 'src/app/service/dialog.service';
import { ReportService } from 'src/app/service/report.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { ReportFilterModel } from 'src/app/model/report/report.filter.model';
import { ProductSoldReportModel } from 'src/app/model/report/product.sold.report.model';


@Component({
  selector: 'app-report-product',
  templateUrl: './report.product.view.html',
  styleUrls: ['./report.product.style.scss']
})

export class ReportProductComponent extends BaseComponent {
  TopProductBestSellReport: ProductSoldReportModel = new ProductSoldReportModel();
  TopProductSellReportFilter: ReportFilterModel = new ReportFilterModel();


  constructor(
    private titleService: Title,
    private reportService: ReportService,
    injector: Injector) {
    super(injector);

  }

  // subscribe object from service
  subscribeObject() {
    this.reportService.TopProductBestSellReport.subscribe(data => this.TopProductBestSellReport = data);
  }

  // init component
  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.REPORT_REVENUE);
    this.subscribeObject();
    this.loadTopProductBestSell();
  }

  // load all top report
  loadTopProductBestSell() {
     this.reportService.loadProductBestSellingReport(this.TopProductSellReportFilter, null);
  }
}
