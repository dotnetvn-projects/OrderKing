import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {  CategoryComponent } from './category.component';
import { CategoryRoutes } from '../../../routing/category.routing';
@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    RouterModule.forChild(CategoryRoutes),
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [CategoryComponent]
})
export class CategoryModule { }
