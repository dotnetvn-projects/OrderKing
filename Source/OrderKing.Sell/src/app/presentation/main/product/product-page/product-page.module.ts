import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductPageComponent } from './product-page.component';
import { CoreModule } from '../../../core/core.module';
import { ProductListModule } from '../product-list/product-list.module';

const productRoutes: Routes = [
  {
    path: '',
    component: ProductPageComponent
  }
];

@NgModule({
  declarations: [
    ProductPageComponent
  ],
  imports: [
    RouterModule.forChild(productRoutes),
    CoreModule,
    ProductListModule
  ],
  exports: [
    ProductPageComponent
  ]
})
export class ProductPageModule { }
