import { Component, Injector, AfterViewInit } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/service/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { OrderService } from 'src/app/service/order.service';
import { OrderModel } from 'src/app/model/order/order.model';
import { OrderFilterModel } from 'src/app/model/order/order.filter.model';
import { OrderDetailModel } from 'src/app/model/order/order.detail.model';
import { AppSettings } from 'src/app/framework/framework.app.setting';

declare var html2canvas: any;
declare var jsPDF: any;
@Component({
  selector: 'app-order-print',
  templateUrl: './order.print.view.html'
})
export class PrintOrderComponent extends BaseComponent {
  OrderDetailList: OrderDetailModel[];
  OrderInfo: OrderModel =  new OrderModel() ;
  private orderId: string;
  private currentUrl = this.getUrl(this.router);
  IsCreatePdf: boolean;
  Width: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute,
    private orderService: OrderService, injector: Injector, private router: Router) {
    super(injector);
    this.Width = '100%';
  }

  async onInit() {
    // get id from url
    this.orderId = this.getParam('id', this.activatedRoute);
    this.getOrderInfo();
    this.OrderDetailList = await this.orderService.getOrderDetailList(this.orderId);

    if (this.currentUrl.match('tao-pdf')) {
      this.IsCreatePdf = true;
      this.Width = '800px';
      const filename = this.OrderInfo.OrderCode + '.pdf';
      setTimeout(() => {
        html2canvas(document.querySelector('#print-content'), { scale: 1, dpi: 96 }).then(canvas => {
          const imgWidth = 211;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          const heightLeft = imgHeight;
          const pdf = new jsPDF('p', 'mm', 'a4');
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
          pdf.save(filename);
        });
      }, 500);
    } else {
      setTimeout(() => { window.print(); }, 500);
    }
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
