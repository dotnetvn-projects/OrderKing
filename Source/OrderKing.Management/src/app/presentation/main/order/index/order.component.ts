import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { OrderService } from 'src/app/service/order.service';
import { OrderModel } from 'src/app/model/order.model';
import { OrderFilterModel } from 'src/app/model/order.filter.model';

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

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.ORDER);
    this.orderService.OrderList.subscribe(orderList => this.OrderList = orderList);
    this.fetchOrderList(() => {
      this.applyDataTable(this.tableId);
     });
  }

  filterData() {
    this.destroyDataTable(this.tableId);
    this.fetchOrderList(() => {
      this.applyDataTable(this.tableId);
     });
  }

  removeOrder(orderid) {

  }

  orderCodeTextChange() {
    const code = this.OrderFilter.OrderCode.trim();
    if (code.length > 0) {
      this.OrderFilter.emptyField();
    } else {
      this.OrderFilter.defaultSearchDate();
    }
  }

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
