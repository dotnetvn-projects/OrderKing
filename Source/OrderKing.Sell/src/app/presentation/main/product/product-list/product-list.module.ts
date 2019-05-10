import { NgModule } from '@angular/core';
import { CoreModule } from '../../../core/core.module';
import { ProductListComponent } from './product-list.component';
import { ProductHorizontalItemModule } from './product-item/product-item.module';
import { OrderDetailService } from '../../../../service/order-detail.service';

@NgModule({
  declarations: [
    ProductListComponent
  ],
  imports: [
    CoreModule,
    ProductHorizontalItemModule
  ],
  exports: [
    ProductListComponent
  ],
  providers: [
    OrderDetailService
  ]
})
export class ProductListModule { }
