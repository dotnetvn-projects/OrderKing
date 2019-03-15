import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { ProductReportModel } from '../model/product.report.model';
import { SummaryReportModel } from '../model/summary.report.model';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  private getSummaryReportUrl = 'report/get-summary-report';
  private getProductSoldDailyUrl = 'report/get-product-sold-daily';

  private productReportDailyListSource = new BehaviorSubject<Array<ProductReportModel>>(new Array<ProductReportModel>());
  ProductReportDailyList = this.productReportDailyListSource.asObservable();

  private summaryReportSource = new BehaviorSubject<SummaryReportModel>(new SummaryReportModel());
  SummaryReport = this.summaryReportSource.asObservable();

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

   // ** get product list sold in day */
   fetchProductSoldDailyList(updateUI) {
    const params = new Dictionary<string, any>();
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getProductSoldDailyUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<ProductReportModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const productInfo = new ProductReportModel();
            productInfo.ProductName = e.ProductName;
            productInfo.TotalSold = e.TotalSold;
            productInfo.Revenue = e.Revenue;
            resultData.push(productInfo);
           });
           this.productReportDailyListSource.next(resultData);
           if (updateUI !== null) {
             updateUI();
          }
        }
    });
  }
}
