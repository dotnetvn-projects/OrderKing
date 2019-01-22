import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  CategoryComponent } from './index/category.component';
import {  CategoryActionComponent } from './action/category.action.component';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { CategoryRoutes } from '../../../routing/category.routing';
@NgModule({
  declarations: [
    CategoryComponent,
    CategoryActionComponent,
  ],
  imports: [
    RouterModule.forChild(CategoryRoutes),
    UiComponentModule,
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [CategoryComponent]
})
export class CategoryModule { }
