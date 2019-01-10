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
  selector: 'app-order-detail',
  templateUrl: './order.detail.view.html',
  styleUrls: ['./order.detail.style.scss']
})
export class OrderDetailComponent extends BaseComponent {

  private tableId = 'table-order';
  constructor(private titleService: Title, private orderService: OrderService, injector: Injector,
    private dialogService: DialogService, private router: Router) {
    super(injector);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.ORDER_DETAIL);
  }
}
