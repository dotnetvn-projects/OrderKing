import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { CategoryModel } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.view.html',
  styleUrls: ['./category.style.scss']
})
export class CategoryComponent extends BaseComponent {
  categoryList: CategoryModel[];

  constructor(private titleService: Title, private categoryService: CategoryService,
     injector: Injector ) {
    super(injector);
 }

 onInit() {
   this.titleService.setTitle(AppSettings.APP_TITLE_MESSAGE.CATEGORY);
   this.categoryService.CategoryList.subscribe(categoryList => this.categoryList = categoryList);
    this.fetchCategoryList(() => {
     this.applyDataTable('dt-table');
    });
 }

 //** load category list and apply datatable js */
 private fetchCategoryList(updateUI) {
  this.categoryService.fetchCategoryList(() => {
      updateUI();
  });
}
}
