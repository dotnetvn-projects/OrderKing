import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { OrderService } from 'src/app/service/order.service';
import { OrderModel } from 'src/app/model/order.model';
import { OrderFilterModel } from 'src/app/model/order.filter.model';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { ExportExcelModel } from 'src/app/model/export.excel.model';
import { ExcelService } from 'src/app/service/export.excel.service';
import { StoreService } from 'src/app/service/store.service';
import { CurrencyPipe } from '../../../_pipes/currency/currency-pipe';

@Component({
  selector: 'app-order',
  templateUrl: './order.view.html',
  styleUrls: ['./order.style.scss']
})
export class OrderComponent extends BaseComponent {
  OrderList: OrderModel[];
  private tableId = 'table-order';
  OrderFilter: OrderFilterModel = new OrderFilterModel();
  private currencyPipe: CurrencyPipe = new CurrencyPipe();

  constructor(private titleService: Title, private orderService: OrderService, injector: Injector,
    private dialogService: DialogService, private excelService: ExcelService,
    private storeService: StoreService, private router: Router) {
    super(injector);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.ORDER);
    this.orderService.OrderList.subscribe(orderList => this.OrderList = orderList);
    this.fetchOrderList(() => {
      this.applyDataTable(this.tableId);
     });
  }

  // ** export excel */
  async exportExcel() {
    const headers =  ['STT', 'Mã ĐH', 'Nhân viên lập đơn', 'Số lượng',
                      'Tổng tiền' , 'PT Thanh toán', 'Ngày tạo', 'Ngày cập nhật', 'Trang thái'];
    const data = [];

    for (let i = 0 ; i < this.OrderList.length ; i++) {
      data.push([(i + 1), this.OrderList[i].OrderCode, this.OrderList[i].Seller,
            this.OrderList[i].Amount,  this.currencyPipe.transform(this.OrderList[i].TotalPrice, 0), this.OrderList[i].PaymentMethod,
            this.OrderList[i].CreatedDate, this.OrderList[i].UpdatedDate, this.OrderList[i].getOrderStatusString()]);
    }

    const excelModel = new ExportExcelModel();
    excelModel.Data = data;
    excelModel.FileName =  'don-hang' + '_export_' + new Date().getTime() + '.xlsx';
    excelModel.Logo = await this.storeService.getStoreLogoBaseByToken();
    excelModel.Headers = headers;
    excelModel.Title = 'Danh sách đơn hàng';
    excelModel.ColumnWidths = [5, 20, 40, 10, 20, 30, 20, 20, 20];
    this.excelService.generateExcel(excelModel);
  }


  // ** search order list */
  filterData() {
    this.destroyDataTable(this.tableId);
    this.fetchOrderList(() => {
      this.applyDataTable(this.tableId);
     });
  }

  // ** remove order out of store*/
  removeOrder(orderid) {
    this.dialogService.showConfirm(AppMessage.APP_DIALOG_TITLE.CONFIRM, AppMessage.APP_DIALOG_MESSAGE.DELETE_ORDER, async () => {
      const result = await this.orderService.RemoveOrder(orderid);
      if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.DELETE_ORDER, () => {
          this.filterData();
        });
      } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        });
      } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
      }
    });
  }

  // ** clear condition when order code is being changed*/
  orderCodeTextChange() {
    const code = this.OrderFilter.OrderCode.trim();
    if (code.length > 0) {
      this.OrderFilter.emptyField();
    } else {
      this.OrderFilter.defaultSearchDate();
    }
  }

  // ** set status when status select input changed*/
  statusSelectChange(event) {
     this.OrderFilter.OrderStatus = event.currentTarget.value;
  }

  // ** load order list and apply datatable js */
  private fetchOrderList(updateUI) {
    this.orderService.fetchOrderList(this.OrderFilter, () => {
        updateUI();
    });
  }
}
