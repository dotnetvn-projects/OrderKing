import { NgModule } from '@angular/core';
import { OrderDetailComponent } from './order-detail.component';
import { OrderItemComponent } from './order-list/order-item.component';
import { CoreModule } from '../../core/core.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    OrderDetailComponent,
    OrderItemComponent
  ],
  imports: [
    CoreModule,
    FontAwesomeModule
  ],
  exports: [
    OrderDetailComponent,
    OrderItemComponent
  ]
})
export class OrderDetailModule { }
