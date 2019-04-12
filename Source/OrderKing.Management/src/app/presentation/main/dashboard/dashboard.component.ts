import { Component, Injector, ViewChild, ViewContainerRef, ComponentFactoryResolver, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { ReportService } from 'src/app/service/report.service';
import { SummaryReportModel } from 'src/app/model/report/summary.report.model';
import { Chart } from 'chart.js';
import { MonthRevenueReportModel } from 'src/app/model/report/month.revenue.report.model';
import { CurrencyPipe } from '../../_pipes/currency/currency-pipe';
import { ProductDailySoldReportModel } from 'src/app/model/report/product.dailysold.report.model';
import { PaginationComponent } from '../../_uicomponents/pagination/pagination.component';
import { StoreModel } from 'src/app/model/store.model';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.style.scss']
})
export class DashboardComponent extends BaseComponent {
  private tableId = 'table-top-sell';
  CurrentYear: number = new Date().getFullYear();
  SummaryReport: SummaryReportModel = new SummaryReportModel();
  ReportProductSoldDaily: ProductDailySoldReportModel;
  MonthRevenueReport: MonthRevenueReportModel = new MonthRevenueReportModel();
  Chart = [];
  StoreInfo: StoreModel;

  @ViewChild('PagerContainer', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  private pagerComponent: any;
  private productPageSize = 7;

  private currencyPipe: CurrencyPipe = new CurrencyPipe();

  constructor(private titleService: Title, injecttor: Injector,
              private reportService: ReportService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private storeService: StoreService) {
    super(injecttor);
  }

  // subscribe object from service
  subscribeObject() {
    this.storeService.StoreInfo.subscribe(store => this.StoreInfo = store);
    this.reportService.SummaryReport.subscribe(reportData => this.SummaryReport = reportData);
    this.reportService.ProductReportDailyList.subscribe(reportData => this.ReportProductSoldDaily = reportData);
    this.reportService.MonthRevenueReport.subscribe(reportData => this.MonthRevenueReport = reportData);
  }

  // init component
  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.DASHBOARD);
    this.subscribeObject();
    this.initChart();
    this.loadSummaryReport();
    this.loadProductSoldDaily(1);
    this.loadMonthRevenueReport();
    this.storeService.fetchStoreInfo();
  }

  // load summary report
  loadSummaryReport() {
     this.reportService.loadSummaryReport();
  }

   // load month revenue report
   loadMonthRevenueReport() {
    this.reportService.loadMonthRevenueReport(this.CurrentYear, () => {
      this.initChart();
    });
 }

  // load prooduct daily sold
  loadProductSoldDaily(page: number = 1) {
    this.reportService.fetchProductSoldDailyList(page, this.productPageSize, () => {
      this.applyDataTable(this.tableId);
      this.loadPager();
    });
  }

  // load chart
  initChart() {
    const self = this; // store here
    this.Chart = new Chart('chartContainer', {
      type: 'line',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
          {
            data: [this.MonthRevenueReport.January, this.MonthRevenueReport.February,
                   this.MonthRevenueReport.March, this.MonthRevenueReport.April,
                   this.MonthRevenueReport.May, this.MonthRevenueReport.June,
                   this.MonthRevenueReport.July, this.MonthRevenueReport.August,
                   this.MonthRevenueReport.September, this.MonthRevenueReport.October,
                   this.MonthRevenueReport.November, this.MonthRevenueReport.December],
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                return self.currencyPipe.transform(tooltipItem.value, 0);
              }
          }
      },
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true,
            ticks: {
              beginAtZero: true,
              callback: function(value, index, values) {
                return self.currencyPipe.transform(value, 0);
              }
            }
          }],
        }
      }
    });
   }


  // ------ UI Processing ------

   // load page follow to page change event
  private productSoldDailyPageChange(page) {
    this.loadProductSoldDaily(page);
  }

  // load product pager
  private loadPager() {
    // load pager dynamic
    if (this.pagerComponent == null) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
      this.pagerComponent = this.viewContainerRef.createComponent(factory);
      this.pagerComponent.instance.PageChange.subscribe((event) => {
        this.productSoldDailyPageChange(event);
      });
    }

    this.pagerComponent.instance.Css = 'pagination-sm no-margin pull-right';
    this.pagerComponent.instance.PageSize = this.productPageSize;
    this.pagerComponent.instance.TotalPage = this.ReportProductSoldDaily.TotalRecord;
    this.pagerComponent.changeDetectorRef.detectChanges();
  }

  // delect window change and update chart
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.initChart();
  }

  // ------ End UI Processing ------
}
