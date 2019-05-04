import { NgModule } from '@angular/core';
import { FeedListComponent } from './feed-list.component';
import { CoreModule } from '../../../core/core.module';
import { Routes, RouterModule } from '@angular/router';
import { FeedItemComponent } from './feed-item/feed-item.component';
import { ProductHorizontalItemModule } from '../../../../presentation/main/product/product-list/product-item/product-item.module';
import { OrderDetailModule } from '../../order/order-detail.module';
import { OrderDetailService } from '../../../../service/order-detail.service';

const feedListRoutes: Routes = [
  {
    path: '',
    component: FeedListComponent
  }
];

@NgModule({
  declarations: [
    FeedListComponent,
    FeedItemComponent
  ],
  imports: [
    RouterModule.forChild(feedListRoutes),
    CoreModule,
    OrderDetailModule,
    ProductHorizontalItemModule
  ],
  exports: [
    RouterModule,
    FeedListComponent,
    FeedItemComponent,
  ],
  providers: [OrderDetailService]
})
export class FeedListModule { }
