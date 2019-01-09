import { Component, Injector } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { OrderService } from 'src/app/service/order.service';
import { OrderModel } from 'src/app/model/order.model';
import { OrderFilterModel } from 'src/app/model/order.filter.model';
declare var $;

@Component({
  selector: 'app-order',
  templateUrl: './order.view.html',
  styleUrls: ['./order.style.scss']
})
export class OrderComponent extends BaseComponent {
  OrderList: OrderModel[];
  private tableId = 'table-order';
  OrderFilter: OrderFilterModel = new OrderFilterModel();

  constructor(private titleService: Title, private orderService: OrderService, injector: Injector,
    private dialogService: DialogService, private router: Router) {
    super(injector);
  }

  applyJs() {
    $(() => {
      $('.order-fromdate').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' });
      $('.order-todate').inputmask('dd/mm/yyyy', { 'placeholder': 'dd/mm/yyyy' });
    });
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STAFF);
    this.orderService.OrderList.subscribe(orderList => this.OrderList = orderList);
    this.fetchOrderList(() => {
     this.applyDataTable(this.tableId);
    });
  }

  filterData() {
     const t = 'ưefwefwe';
     const s = this.OrderFilter;
  }

  removeOrder(orderid) {

  }

  // ** load order list and apply datatable js */
  private fetchOrderList(updateUI) {
    this.orderService.fetchOrderList(() => {
        updateUI();
    });
  }
}
