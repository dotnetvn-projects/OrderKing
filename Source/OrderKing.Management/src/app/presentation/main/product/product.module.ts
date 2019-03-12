import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  ProductComponent } from './index/product.component';
import {  ProductActionComponent } from './action/product.action.component';
import { ProductRoutes } from '../../../routing/product.routing';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { DirectiveModule } from '../../_directives/directive.module';
import { PipeModule } from '../../_pipes/pipe.module';

@NgModule({
  declarations: [
    ProductComponent,
    ProductActionComponent
  ],
  imports: [
    RouterModule.forChild(ProductRoutes),
    UiComponentModule,
    CommonModule, FormsModule,
    DirectiveModule,
    PipeModule
  ],
  providers: [],
  bootstrap: [ProductComponent]
})
export class ProductModule { }
