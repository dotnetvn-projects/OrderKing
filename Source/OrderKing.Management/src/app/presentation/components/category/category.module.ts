import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {  CategoryComponent } from './index/category.component';
import {  CreateCategoryComponent } from './create/category.create.component';
import {  UpdateCategoryComponent } from './update/category.update.component';
import { CategoryRoutes } from '../../../routing/category.routing';
@NgModule({
  declarations: [
    CategoryComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent
  ],
  imports: [
    RouterModule.forChild(CategoryRoutes),
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [CategoryComponent]
})
export class CategoryModule { }
