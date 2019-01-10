import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { OrderModel } from '../model/order.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { OrderFilterModel } from '../model/order.filter.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private getOrderListUrl = 'order/get-order-list';
  private searchOrderUrl = 'order/search-order';
  private detailUrl = 'order/get-info';

  private orderListSource = new BehaviorSubject<Array<OrderModel>>(
    new Array<OrderModel>()
  );
  OrderList = this.orderListSource.asObservable();

  constructor(private webClient: WebClientService) {}

  fetchOrderList(filter: OrderFilterModel, updateUI) {
    let endpoint = this.getOrderListUrl;
    const params = new Dictionary<string, any>();
    if (filter.OrderCode.length > 0 || filter.FromDate.length > 0
       || filter.ToDate.length > 0 || filter.OrderStatus !== '0') {
          endpoint = this.searchOrderUrl;
          params.put('OrderCode', filter.OrderCode);
          params.put('StartDate', filter.FromDate);
          params.put('EndDate', filter.ToDate);
          params.put('OrderStatus', filter.OrderStatus);
       }

    this.webClient.doPost(AppSettings.API_ENDPOINT + endpoint, params, (data: ApiResultModel) => {
        const resultData = new Array<OrderModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const orderInfo = new OrderModel();
            orderInfo.Id = e.orderid;
            orderInfo.StoreName = e.storename;
            orderInfo.OrderCode = e.ordercode;
            orderInfo.SeqNum = e.seqnum;
            orderInfo.TotalPrice = e.totalprice;
            orderInfo.Amount = e.amount;
            orderInfo.CreatedDate = e.createddate;
            orderInfo.UpdatedDate = e.updateddate;
            orderInfo.Seller = e.seller;
            orderInfo.SellerAccount = e.selleraccount;
            orderInfo.Comment = e.comment;
            orderInfo.OrderStatus = e.orderstatus;

            resultData.push(orderInfo);
          });
          this.orderListSource.next(resultData);
          if (updateUI !== null) {
            updateUI();
          }
        }
      }
    );
  }

  async getOrderById(orderId) {
    const info = { result: AppSettings.RESPONSE_MESSAGE.ERROR, orderInfo: null };
    const params = new Dictionary<string, any>();
    params.put('OrderId', orderId);

    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.detailUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          if (data.Result !== null) {
            info.result = AppSettings.RESPONSE_MESSAGE.SUCCESS;

          }
        } else if (
          data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED
        ) {
          info.result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else {
          info.result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
      }
    );

    return info;
  }
}
