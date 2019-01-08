import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { OrderModel } from '../model/order.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private getOrderListUrl = 'order/get-order-list';

  private orderListSource = new BehaviorSubject<Array<OrderModel>>(
    new Array<OrderModel>()
  );
  OrderList = this.orderListSource.asObservable();

  constructor(private webClient: WebClientService) {}

  fetchOrderList(updateUI) {
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getOrderListUrl, null, (data: ApiResultModel) => {
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
            orderInfo.PrintedDate = e.printeddate;
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
}
