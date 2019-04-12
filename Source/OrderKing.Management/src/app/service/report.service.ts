import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { ProductReportModel } from '../model/report/product.report.model';
import { SummaryReportModel } from '../model/report/summary.report.model';
import { MonthRevenueReportModel } from '../model/report/month.revenue.report.model';
import { ProductDailySoldReportModel } from '../model/report/product.dailysold.report.model';
import { RevenueReportModel } from '../model/report/revenue.report.model';
import { SaleReportModel } from '../model/report/sale.report.model';
import { ReportFilterModel } from '../model/report/report.filter.model';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  private getSummaryReportUrl = 'report/get-summary-report';
  private getProductSoldDailyUrl = 'report/get-product-sold-daily';
  private getMonthRevenueReportUrl = 'report/get-monthly-revenue-year';
  private getRevenueReportUrl = 'report/get-revenue-report';
  private getSaleReporWithDateRangetUrl = 'report/get-sale-report-date-range';


  private productReportDailyListSource = new BehaviorSubject<ProductDailySoldReportModel>(new ProductDailySoldReportModel());
  ProductReportDailyList = this.productReportDailyListSource.asObservable();

  private summaryReportSource = new BehaviorSubject<SummaryReportModel>(new SummaryReportModel());
  SummaryReport = this.summaryReportSource.asObservable();

  private MonthRevenueReportSource = new BehaviorSubject<MonthRevenueReportModel>(new MonthRevenueReportModel());
  MonthRevenueReport = this.MonthRevenueReportSource.asObservable();

  private RevenueReportSource = new BehaviorSubject<RevenueReportModel>(new RevenueReportModel());
  RevenueReport = this.RevenueReportSource.asObservable();

  private saleReportListSource = new BehaviorSubject<Array<SaleReportModel>>(new Array<SaleReportModel>());
  SaleReportList = this.saleReportListSource.asObservable();

  constructor(private webClient: WebClientService) {

  }

  // ** get report summary */
  loadSummaryReport() {
    const params = new Dictionary<string, any>();
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getSummaryReportUrl, params, (data: ApiResultModel) => {
        const resultData = new SummaryReportModel();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
           resultData.TotalOrder = data.Result.TotalOrder;
           resultData.TotalNewOrder = data.Result.TotalNewOrder;
           resultData.TotalProduct = data.Result.TotalProduct;
           resultData.TotalRevenue = data.Result.TotalRevenue;
           this.summaryReportSource.next(resultData);

        }
    });
  }

    // ** get revenue report in year  */
    loadMonthRevenueReport(year: number, updateUI) {
      const params = new Dictionary<string, any>();
      params.put('Year', year);

      this.webClient.doPost(AppSettings.API_ENDPOINT + this.getMonthRevenueReportUrl, params, (data: ApiResultModel) => {
          const resultData = new MonthRevenueReportModel();
          if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
             resultData.Year = data.Result.Year;
             resultData.Revenue = data.Result.YearRevenue;
             resultData.January = data.Result.January;
             resultData.February = data.Result.February;
             resultData.March = data.Result.March;
             resultData.April = data.Result.April;
             resultData.May = data.Result.May;
             resultData.June = data.Result.June;
             resultData.July = data.Result.July;
             resultData.August = data.Result.August;
             resultData.September = data.Result.September;
             resultData.October = data.Result.October;
             resultData.November = data.Result.November;
             resultData.December = data.Result.December;
             this.MonthRevenueReportSource.next(resultData);
             updateUI();
          }
      });
    }

   // ** get product list sold in day */
   fetchProductSoldDailyList(page, pageSize, updateUI) {
    const params = new Dictionary<string, any>();
    params.put('PageSize', pageSize);
    params.put('PageNumber', page);
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getProductSoldDailyUrl, params, (data: ApiResultModel) => {
        const resultData = new ProductDailySoldReportModel();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          resultData.ProductList = new Array<ProductReportModel>();
          data.Result.forEach(e => {
            const productInfo = new ProductReportModel();
            productInfo.ProductCode = e.ProductCode;
            productInfo.ProductName = e.ProductName;
            productInfo.TotalSold = e.TotalSold;
            productInfo.Revenue = e.Revenue;
            resultData.ProductList.push(productInfo);
            resultData.TotalRecord = e.TotalRecord;
           });
           this.productReportDailyListSource.next(resultData);
           if (updateUI !== null) {
             updateUI();
          }
        }
    });
  }

   // ** get revenue report */
   loadRevenueReport() {
    const params = new Dictionary<string, any>();
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getRevenueReportUrl, params, (data: ApiResultModel) => {
        const resultData = new RevenueReportModel();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
           resultData.DailyRevenue = data.Result.DailyRevenue;
           resultData.WeeklyRevenue = data.Result.WeeklyRevenue;
           resultData.MonthlyRevenue = data.Result.MonthlyRevenue;
           resultData.YearlyRevenue = data.Result.YearlyRevenue;
           this.RevenueReportSource.next(resultData);

        }
    });
  }

  // ** get sale report with date range*/
  loadSaleReport(filter: ReportFilterModel, updateUI) {
    const params = new Dictionary<string, any>();
    params.put('StartDate', filter.FromDate);
    params.put('EndDate', filter.ToDate);
    params.put('PageSize', filter.PageSize);
    params.put('PageNumber', filter.PageNumber);
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getSaleReporWithDateRangetUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<SaleReportModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const saleReportModel = new SaleReportModel();
            saleReportModel.CreateDate = e.CreateDate;
            saleReportModel.TotalOrder = e.TotalOrder;
            saleReportModel.TotalSold = e.TotalSold;
            saleReportModel.TotalRevenue = e.TotalRevenue;

            resultData.push(saleReportModel);
          });

          for ( let i = 1 ; i < resultData.length ; i++) {
             const j = i - 1;
             const currentItem = resultData[i];
             const previousItem = resultData[j];
             const currentRevenue = Number(currentItem.TotalSold);
             const previousRevenue = Number(previousItem.TotalSold);

             if (currentRevenue === previousRevenue) {
              currentItem.Trend = AppSettings.SALE_TRENDING.SAME;
             } else if (currentRevenue > previousRevenue) {
               currentItem.Trend = AppSettings.SALE_TRENDING.UP;
             } else {
              currentItem.Trend = AppSettings.SALE_TRENDING.DOWN;
             }
          }

          this.saleReportListSource.next(resultData);
          if (updateUI !== null) {
            updateUI();
          }
        }
      }
    );
  }
}
