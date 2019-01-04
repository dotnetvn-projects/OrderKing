import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  StoreComponent  } from './index/store.component';
import {  StoreActionComponent  } from './action/store.action.component';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { StoreRoutes } from '../../../routing/store.routing';
import { DirectiveModule } from '../../_directives/directive.module';


@NgModule({
  declarations: [
    StoreComponent,
    StoreActionComponent
  ],
  imports: [
    RouterModule.forChild(StoreRoutes),
    CommonModule, FormsModule, UiComponentModule, DirectiveModule
  ],
  providers: [],
  bootstrap: [StoreComponent]
})
export class StoreModule { }
