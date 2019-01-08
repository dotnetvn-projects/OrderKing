import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {   OrderComponent  } from './index/order.component';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { OrderRoutes } from '../../../routing/order.routing';
import { DirectiveModule } from '../../_directives/directive.module';


@NgModule({
  declarations: [
    OrderComponent
  ],
  imports: [
    RouterModule.forChild(OrderRoutes),
    CommonModule, FormsModule, UiComponentModule, DirectiveModule
  ],
  providers: [],
  bootstrap: [OrderComponent]
})
export class OrderModule { }
