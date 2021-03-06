import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { OrderModel } from '../model/order/order.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { OrderFilterModel } from '../model/order/order.filter.model';
import { OrderDetailModel } from '../model/order/order.detail.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private getOrderListUrl = 'order/get-order-list';
  private searchOrderUrl = 'order/search-order';
  private detailUrl = 'order/get-detail';
  private infoUrl = 'order/get-info';
  private updateStatusUrl = 'order/update-status';
  private updateCommentUrl = 'order/update-comment';
  private removeOrderUrl = 'order/remove';

  private orderListSource = new BehaviorSubject<Array<OrderModel>>(new Array<OrderModel>());
  OrderList = this.orderListSource.asObservable();

  private orderDetailListSource = new BehaviorSubject<Array<OrderDetailModel>>(new Array<OrderDetailModel>());
  OrderDetailList = this.orderDetailListSource.asObservable();

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
            orderInfo.PaymentMethod = e.paymentmethod;

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

  fetchOrderDetailList(orderId) {
    const params = new Dictionary<string, any>();
    params.put('OrderId', orderId);

     this.webClient.doPost(AppSettings.API_ENDPOINT + this.detailUrl, params, (data: ApiResultModel) => {
      const resultData = new Array<OrderDetailModel>();
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        data.Result.forEach(e => {
          const detailInfo = new OrderDetailModel();
          detailInfo.Id = e.id;
          detailInfo.ProductName = e.productname;
          detailInfo.ProductCode = e.productcode;
          detailInfo.Amount = e.amount;
          detailInfo.Price = e.price;
          detailInfo.Total = e.total;
          resultData.push(detailInfo);
        });
        this.orderDetailListSource.next(resultData);
      }
    }
  );
  }

  async getOrderDetailList(orderId) {
    const params = new Dictionary<string, any>();
    params.put('OrderId', orderId);
    const resultData = new Array<OrderDetailModel>();
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.detailUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        data.Result.forEach(e => {
          const detailInfo = new OrderDetailModel();
          detailInfo.Id = e.id;
          detailInfo.ProductName = e.productname;
          detailInfo.ProductCode = e.productcode;
          detailInfo.Amount = e.amount;
          detailInfo.Price = e.price;
          detailInfo.Total = e.total;
          resultData.push(detailInfo);
        });
      }
    });
    return resultData;
  }

  // get order info by id
  async getOrderInfoById(id: string) {
    const info = { result: AppSettings.RESPONSE_MESSAGE.ERROR, orderInfo: null };
    const params = new Dictionary<string, any>();
    params.put('OrderId', id);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.infoUrl, params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          if (data.Result !== null) {
            info.result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
            const order = new OrderModel();
            order.Id = data.Result.orderid;
            order.StoreName = data.Result.storename;
            order.OrderCode = data.Result.ordercode;
            order.SeqNum = data.Result.seqnum;
            order.TotalPrice = data.Result.totalprice;
            order.Amount = data.Result.amount;
            order.CreatedDate = data.Result.createddate;
            order.UpdatedDate = data.Result.updateddate;
            order.OrderStatus = data.Result.orderstatus;
            order.SellerAccount = data.Result.selleraccount;
            order.Seller = data.Result.seller;
            order.Comment = data.Result.commemt;
            order.PaymentMethod = data.Result.paymentmethod;
            info.orderInfo = order;
          }
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          info.result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else {
          info.result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
      }
    );

    return info;
  }

  // ** update order status */
  async updateOrderStatus(orderInfo: OrderModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('OrderId', orderInfo.Id);
    params.put('OrderStatus', orderInfo.OrderStatus);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.updateStatusUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
      }
    );
    return result;
  }

  // ** update order comment */
  async updateOrderComment(orderInfo: OrderModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('OrderId', orderInfo.Id);
    params.put('Comment', orderInfo.Comment);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.updateCommentUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
      }
    );

    return result;
  }


  // ** remove status */
  async RemoveOrder(orderId) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('OrderId', orderId);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.removeOrderUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
      }
    );
    return result;
  }
}
