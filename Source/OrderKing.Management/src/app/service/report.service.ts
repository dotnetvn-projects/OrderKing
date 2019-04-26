import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { ProductReportModel } from '../model/report/product.report.model';
import { SummaryReportModel } from '../model/report/summary.report.model';
import { MonthRevenueReportModel } from '../model/report/month.revenue.report.model';
import { ProductSoldReportModel } from '../model/report/product.sold.report.model';
import { RevenueReportModel } from '../model/report/revenue.report.model';
import { SaleReportModel } from '../model/report/sale.report.model';
import { ReportFilterModel } from '../model/report/report.filter.model';
import { SaleDetailReportModel } from '../model/report/sale.detail.report.model';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  private getSummaryReportUrl = 'report/get-summary-report';
  private getProductSoldDailyUrl = 'report/get-product-sold-daily';
  private getMonthRevenueReportUrl = 'report/get-monthly-revenue-year';
  private getRevenueReportUrl = 'report/get-revenue-report';
  private getSaleReporWithDateRangetUrl = 'report/get-sale-report-date-range';
  private getProductSoldReporWithDateRangetUrl = 'report/get-product-sold-report-date-range';
  private getTopProductBestSellUrl = 'report/get-product-best-sell';


  private productReportDailySource = new BehaviorSubject<ProductSoldReportModel>(new ProductSoldReportModel());
  ProductReportProductDailySold = this.productReportDailySource.asObservable();

  private productReportSoldSource = new BehaviorSubject<ProductSoldReportModel>(new ProductSoldReportModel());
  ProductReportSold = this.productReportSoldSource.asObservable();

  private topProductBestSellReportSource = new BehaviorSubject<ProductSoldReportModel>(new ProductSoldReportModel());
  TopProductBestSellReport = this.topProductBestSellReportSource.asObservable();


  private summaryReportSource = new BehaviorSubject<SummaryReportModel>(new SummaryReportModel());
  SummaryReport = this.summaryReportSource.asObservable();

  private monthRevenueReportSource = new BehaviorSubject<MonthRevenueReportModel>(new MonthRevenueReportModel());
  MonthRevenueReport = this.monthRevenueReportSource.asObservable();

  private revenueReportSource = new BehaviorSubject<RevenueReportModel>(new RevenueReportModel());
  RevenueReport = this.revenueReportSource.asObservable();

  private saleReporSource = new BehaviorSubject<SaleReportModel>(new SaleReportModel());
  SaleReport = this.saleReporSource.asObservable();

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
             this.monthRevenueReportSource.next(resultData);
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
        const resultData = new ProductSoldReportModel();
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
           this.productReportDailySource.next(resultData);
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
           this.revenueReportSource.next(resultData);
        }
    });
  }

  // ** get sale report by date range*/
  loadSaleReport(filter: ReportFilterModel, updateUI) {
    const params = new Dictionary<string, any>();
    params.put('StartDate', filter.FromDate);
    params.put('EndDate', filter.ToDate);
    params.put('PageSize', filter.PageSize);
    params.put('PageNumber', filter.PageNumber);
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getSaleReporWithDateRangetUrl, params, (data: ApiResultModel) => {
        const resultData = new SaleReportModel();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          resultData.SaleReportList = new Array<SaleDetailReportModel>();
          data.Result.forEach(e => {
            const saleDetailReportModel = new SaleDetailReportModel();
            saleDetailReportModel.CreatedDate = e.CreatedDate;
            saleDetailReportModel.TotalOrder = e.TotalOrder;
            saleDetailReportModel.TotalSold = e.TotalSold;
            saleDetailReportModel.TotalRevenue = e.TotalRevenue;
            resultData.TotalRecord = e.TotalRecord;
            resultData.SaleReportList.push(saleDetailReportModel);
          });

          for ( let i = 0 ; i < resultData.SaleReportList.length - 1 ; i++) {
             const j = i + 1;
             const currentItem = resultData.SaleReportList[i];
             const previousItem = resultData.SaleReportList[j];
             const currentRevenue = Number(currentItem.TotalRevenue);
             const previousRevenue = Number(previousItem.TotalRevenue);

             if (currentRevenue === previousRevenue) {
              resultData.SaleReportList[i].Trend = AppSettings.SALE_TRENDING.SAME;
             } else if (currentRevenue > previousRevenue) {
              resultData.SaleReportList[i].Trend = AppSettings.SALE_TRENDING.UP;
             } else {
              resultData.SaleReportList[i].Trend = AppSettings.SALE_TRENDING.DOWN;
             }
          }

          this.saleReporSource.next(resultData);
          if (updateUI !== null) {
            updateUI();
          }
        }
      }
    );
  }

    // ** get product sold report by date range*/
    loadProductSoldReport(filter: ReportFilterModel, updateUI) {
      const params = new Dictionary<string, any>();
      params.put('StartDate', filter.FromDate);
      params.put('EndDate', filter.ToDate);
      params.put('PageSize', filter.PageSize);
      params.put('PageNumber', filter.PageNumber);
      this.webClient.doPost(AppSettings.API_ENDPOINT + this.getProductSoldReporWithDateRangetUrl, params, (data: ApiResultModel) => {
          const resultData = new ProductSoldReportModel();
          if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
            resultData.ProductList = new Array<ProductReportModel>();
            data.Result.forEach(e => {
              const productReport = new ProductReportModel();
              productReport.Id = e.ProductId;
              productReport.ProductCode = e.ProductCode;
              productReport.ProductName = e.ProductName;
              productReport.TotalSold = e.TotalSold;
              productReport.Revenue = e.TotalRevenue;
              resultData.TotalRecord = e.TotalRecord;
              resultData.ProductList.push(productReport);
            });

            this.productReportSoldSource.next(resultData);
            if (updateUI !== null) {
              updateUI();
            }
          }
        }
      );
    }



    // ** get top product best selling **/
    loadProductBestSellingReport(filter: ReportFilterModel, updateUI) {
      const params = new Dictionary<string, any>();
      params.put('Type', filter.Type);
      params.put('Top', filter.Top);

      this.webClient.doPost(AppSettings.API_ENDPOINT + this.getTopProductBestSellUrl, params, (data: ApiResultModel) => {
          const resultData = new ProductSoldReportModel();
          if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
            resultData.ProductList = new Array<ProductReportModel>();
            data.Result.forEach(e => {
              const productReport = new ProductReportModel();
              productReport.Id = e.ProductId;
              productReport.ProductCode = e.ProductCode;
              productReport.ProductName = e.ProductName;
              productReport.TotalSold = e.TotalSold;
              productReport.Revenue = e.TotalRevenue;
              resultData.TotalRecord = e.TotalRecord;
              resultData.ProductList.push(productReport);
            });

            this.topProductBestSellReportSource.next(resultData);
            if (updateUI !== null) {
              updateUI();
            }
          }
        }
      );
    }
}
