import { NgModule } from '@angular/core';
import { OrderDetailComponent } from './order-detail.component';

@NgModule({
  declarations: [
    OrderDetailComponent
  ],
  exports: [
    OrderDetailComponent,
  ]
})
export class OrderDetailModule { }
