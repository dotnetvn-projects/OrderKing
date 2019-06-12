import { Component, Injector, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { DialogService } from 'src/app/service/dialog.service';
import { ReportService } from 'src/app/service/report.service';
import { RevenueReportModel } from 'src/app/model/report/revenue.report.model';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { SaleReportModel } from 'src/app/model/report/sale.report.model';
import { ReportFilterModel } from 'src/app/model/report/report.filter.model';
import { PaginationComponent } from 'src/app/presentation/_uicomponents/pagination/pagination.component';
import { Validator } from 'src/app/framework/framework.validate';
import { ProductSoldReportModel } from 'src/app/model/report/product.sold.report.model';


@Component({
  selector: 'app-report-revenue',
  templateUrl: './report.revenue.view.html',
  styleUrls: ['./report.revenue.style.scss']
})

export class ReportRevenueComponent extends BaseComponent {
  RevenueReport: RevenueReportModel = new RevenueReportModel();
  SaleReport: SaleReportModel = new SaleReportModel();
  ProductSoldReport: ProductSoldReportModel = new ProductSoldReportModel();
  SaleReportFilter: ReportFilterModel = new ReportFilterModel();
  ProductSoldReportFilter: ReportFilterModel = new ReportFilterModel();


  @ViewChild('SaleReportPagerContainer', { read: ViewContainerRef }) saleReportViewContainerRef: ViewContainerRef;
  private saleReportPagerComponent: any;

  @ViewChild('ProductSoldReportPagerContainer', { read: ViewContainerRef }) productSoldReportViewContainerRef: ViewContainerRef;
  private productSoldReportPagerComponent: any;

  constructor(
    private titleService: Title,
    private dialogService: DialogService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private reportService: ReportService,
    injector: Injector) {
    super(injector);

  }

  // subscribe object from service
  subscribeObject() {
    this.reportService.RevenueReport.subscribe(data => this.RevenueReport = data);
    this.reportService.SaleReport.subscribe(data => this.SaleReport = data);
    this.reportService.ProductReportSold.subscribe(data => this.ProductSoldReport = data);
  }

  // init component
  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.REPORT_REVENUE);
    this.subscribeObject();
    this.loadRevenueReport();
    this.loadSaleReport();
    this.loadProductSoldReport();
  }

  // load revenue report
  loadRevenueReport() {
     this.reportService.loadRevenueReport();
  }

  // load sale report
  loadSaleReport() {
    if (Validator.isValidDateRange(this.SaleReportFilter.FromDate, this.SaleReportFilter.ToDate)) {
      this.reportService.loadSaleReport(this.SaleReportFilter, () => {
        this.loadSaleReportPager();
      });
    } else {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.WRONG_DATE_RANGE, null);
    }
 }

  // load sale report pager
  private loadSaleReportPager() {
    // load pager dynamic
    if (this.saleReportPagerComponent == null) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
      this.saleReportPagerComponent = this.saleReportViewContainerRef.createComponent(factory);
      this.saleReportPagerComponent.instance.PageChange.subscribe((event) => {
        this.SaleReportFilter.PageNumber = event;
        this.loadSaleReport();
      });
    }

    this.saleReportPagerComponent.instance.Css = 'pagination no-margin pull-right';
    this.saleReportPagerComponent.instance.PageSize = this.SaleReportFilter.PageSize;
    this.saleReportPagerComponent.instance.TotalPage = this.SaleReport.TotalRecord;
    this.saleReportPagerComponent.changeDetectorRef.detectChanges();
  }


  // load product sold report
  loadProductSoldReport() {
    if (Validator.isValidDateRange(this.ProductSoldReportFilter.FromDate, this.ProductSoldReportFilter.ToDate)) {
      this.reportService.loadProductSoldReport(this.ProductSoldReportFilter, () => {
        this.loadProductSoldReportPager();
      });
    } else {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.WRONG_DATE_RANGE, null);
    }
 }

  // load product sold report pager
  private loadProductSoldReportPager() {
    // load pager dynamic
    if (this.productSoldReportPagerComponent == null) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
      this.productSoldReportPagerComponent = this.productSoldReportViewContainerRef.createComponent(factory);
      this.productSoldReportPagerComponent.instance.PageChange.subscribe((event) => {
        this.ProductSoldReportFilter.PageNumber = event;
        this.loadProductSoldReport();
      });
    }

    this.productSoldReportPagerComponent.instance.Css = 'pagination no-margin pull-right';
    this.productSoldReportPagerComponent.instance.PageSize = this.ProductSoldReportFilter.PageSize;
    this.productSoldReportPagerComponent.instance.TotalPage = this.ProductSoldReport.TotalRecord;
    this.productSoldReportPagerComponent.changeDetectorRef.detectChanges();
  }

}
