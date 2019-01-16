import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/service/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { OrderService } from 'src/app/service/order.service';
import { OrderModel } from 'src/app/model/order.model';
import { OrderFilterModel } from 'src/app/model/order.filter.model';
import { OrderDetailModel } from 'src/app/model/order.detail.model';
import { AppSettings } from 'src/app/framework/framework.app.setting';

@Component({
  selector: 'app-order-print',
  templateUrl: './order.print.view.html'
})
export class PrintOrderComponent extends BaseComponent {
  OrderDetailList: OrderDetailModel[];
  OrderInfo: OrderModel =  new OrderModel() ;
  private orderId: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute,
    private orderService: OrderService, injector: Injector, private router: Router) {
    super(injector);
  }

   async onInit() {
    // get id from url
    this.orderId = this.getParam('id', this.activatedRoute);
   // this.orderService.OrderDetailList.subscribe(orderDetailList => this.OrderDetailList = orderDetailList);
    this.getOrderInfo();
    this.OrderDetailList = await this.orderService.getOrderDetailList(this.orderId);
    setTimeout(() => { window.print(); } , 300);
  }

   // ** Load order by id*/
   private async getOrderInfo() {
    const iresult = await this.orderService.getOrderInfoById(this.orderId);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['/page-not-found']);
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.authService.clearLoginSession();
      await this.gotoLogin(this.router);
    } else {
      this.OrderInfo = iresult.orderInfo;
      this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.ORDER_PRINT + this.OrderInfo.OrderCode);
    }
  }

}
