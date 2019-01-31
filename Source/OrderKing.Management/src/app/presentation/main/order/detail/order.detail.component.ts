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
  selector: 'app-order-detail',
  templateUrl: './order.detail.view.html',
  styleUrls: ['./order.detail.style.scss']
})
export class OrderDetailComponent extends BaseComponent {
  OrderDetailList: OrderDetailModel[];
  OrderInfo: OrderModel =  new OrderModel() ;
  private orderId: string;
  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private orderService: OrderService, injector: Injector,
    private dialogService: DialogService, private router: Router) {
    super(injector);
  }

   onInit() {
    // get id from url
    this.orderId = this.getParam('id', this.activatedRoute);
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.ORDER_DETAIL);
    this.orderService.OrderDetailList.subscribe(orderDetailList => this.OrderDetailList = orderDetailList);
    this.getOrderInfo();
    this.orderService.fetchOrderDetailList(this.orderId);
  }

    // // ** export excel */
    // async exportExcel() {
    //   const headers =  ['STT', 'Họ và tên', 'Điện thoại', 'Địa chỉ thường trú',
    //                    'Địa chỉ tạm trú', 'Số CMND', 'Email' , 'Ngày tạo', 'Trạng thái'];
    //   const data = [];

    //   for (let i = 0 ; i < this.StaffList.length ; i++) {
    //    let status = 'Kích hoạt';
    //    if (!this.StaffList[i].IsActived) {
    //       status = 'Khóa';
    //    }
    //    data.push([(i + 1), this.StaffList[i].FullName, this.StaffList[i].PhoneNumber,
    //          this.StaffList[i].Address, this.StaffList[i].Address2, this.StaffList[i].IdentityCard,
    //          this.StaffList[i].Email, this.StaffList[i].CreatedDate, status]);
    //   }

    //   const excelModel = new ExportExcelModel();
    //   excelModel.Data = data;
    //   excelModel.FileName =  'nhan-vien' + '_export_' + new Date().getTime() + '.xlsx';
    //   excelModel.Logo = await this.storeService.getStoreLogoBaseByToken();
    //   excelModel.Headers = headers;
    //   excelModel.Title = 'Danh sách nhân viên';
    //   excelModel.ColumnWidths = [5, 30, 20, 40, 40, 20, 25, 15, 15];
    //   this.excelService.generateExcel(excelModel);
    // }

  // ** update order */
 async updateOrder() {
    let result = await this.orderService.updateOrderStatus(this.OrderInfo);
    result = await this.orderService.updateOrderComment(this.OrderInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.dialogService.showSuccess(
        AppMessage.APP_SUCCESS_MESSAGE.UPDATE_ORDER,
        () => {
          this.router.navigate(['don-hang/chi-tiet', this.orderId]);
        }
      );
    } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.dialogService.showError(
        AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT,
        () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        }
      );
    } else {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
    }
  }

  // ** Load order by id*/
  private async getOrderInfo() {
    const iresult = await this.orderService.getOrderInfoById(this.orderId);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['/page-not-found']); // TODO display not found page
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.authService.clearLoginSession();
      await this.gotoLogin(this.router);
    } else {
      this.OrderInfo = iresult.orderInfo;
    }
  }

  statusSelectChange(event) {
    this.OrderInfo.OrderStatus = event.currentTarget.value;
  }
}
