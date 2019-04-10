import { NgModule } from '@angular/core';
import { CoreModule } from '../../../core/core.module';
import { ProductListComponent } from './product-list.component';
import { ProductHorizontalItemModule } from './product-item/product-item.module';

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
  ]
})
export class ProductListModule { }
