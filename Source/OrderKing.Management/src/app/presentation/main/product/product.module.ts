import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  ProductComponent } from './index/product.component';
import { ProductRoutes } from '../../../routing/product.routing';
@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    RouterModule.forChild(ProductRoutes),
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [ProductComponent]
})
export class ProductModule { }
