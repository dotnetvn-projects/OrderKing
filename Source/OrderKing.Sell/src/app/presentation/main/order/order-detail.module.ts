import { NgModule } from '@angular/core';
import { OrderDetailComponent } from './order-detail.component';
import { OrderItemComponent } from './order-list/order-item.component';
import { CoreModule } from '../../core/core.module';

@NgModule({
  declarations: [
    OrderDetailComponent,
    OrderItemComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    OrderDetailComponent,
    OrderItemComponent
  ]
})
export class OrderDetailModule { }
