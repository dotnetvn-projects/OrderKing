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

@Component({
  selector: 'app-order',
  templateUrl: './order.view.html',
  styleUrls: ['./order.style.scss']
})
export class OrderComponent extends BaseComponent {
  OrderList: OrderModel[];
  private tableId = 'table-order';

  constructor(private titleService: Title, private orderService: OrderService, injector: Injector,
    private dialogService: DialogService, private router: Router) {
    super(injector);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STAFF);
    this.orderService.OrderList.subscribe(orderList => this.OrderList = orderList);
    this.fetchOrderList(() => {
     this.applyDataTable(this.tableId);
    });
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
