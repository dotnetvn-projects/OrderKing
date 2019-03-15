import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { ReportService } from 'src/app/service/report.service';
import { SummaryReportModel } from 'src/app/model/summary.report.model';
import { ProductReportModel } from 'src/app/model/product.report.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.style.scss']
})
export class DashboardComponent extends BaseComponent {
  private tableId = 'table-top-sell';
  SummaryReport: SummaryReportModel = new SummaryReportModel();
  ReportProductSoldDailyList: ProductReportModel[];
  chart = [];
  constructor(private titleService: Title, injecttor: Injector, private reportService: ReportService) {
    super(injecttor);
  }

  applyJs() {
    this.initChart();
  }

  // subscribe object from service
  subscribeObject() {
    this.reportService.SummaryReport.subscribe(reportData => this.SummaryReport = reportData);
    this.reportService.ProductReportDailyList.subscribe(reportData => this.ReportProductSoldDailyList = reportData);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.DASHBOARD);
    this.subscribeObject();
    this.loadSummaryReport();
    this.loadProductSoldDaily();
  }

  // load summary report
  loadSummaryReport() {
     this.reportService.loadSummaryReport();
  }

  // load prooduct daily sold
  loadProductSoldDaily() {
    this.reportService.fetchProductSoldDailyList(() => {
      this.applyDataTable(this.tableId);
    });
  }

  initChart() {

    this.chart = new Chart('chartContainer', {
      type: 'line',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
          {
            data: [10000, 100000, 12000000, 5000000, 6000000, 8000000,
                   1200000, 1400000, 1200000 , 1200000 , 1200000 , 1200000],
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  return 'dđ';
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
                 return '$' + value;
              }
            }
          }],
        }
      }
    });
   }
}
