import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { CategoryModel } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/service/category.service';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { ExcelService } from 'src/app/service/export.excel.service';
import { ExportExcelModel } from 'src/app/model/export.excel.model';
import { StoreService } from 'src/app/service/store.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.view.html',
  styleUrls: ['./category.style.scss']
})
export class CategoryComponent extends BaseComponent {
  categoryList: CategoryModel[];
  private tableId = 'table-category';

  constructor(private titleService: Title, private dialogService: DialogService,
    private router: Router, private categoryService: CategoryService, private excelService: ExcelService,
     injector: Injector, private storeService: StoreService ) {
    super(injector);
 }

 onInit() {
   this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.CATEGORY);
   this.categoryService.CategoryList.subscribe(categoryList => this.categoryList = categoryList);
   this.fetchCategoryList(() => {
     this.applyDataTable(this.tableId);
   });
 }

  // ** export excel */
 async exportExcel() {
   const headers =  ['STT', 'Tên danh mục', 'Số lượng mặt hàng', 'Ngày tạo'];
   const data = [];

   for (let i = 0 ; i < this.categoryList.length ; i++) {
    data.push([(i + 1), this.categoryList[i].CategoryName, this.categoryList[i].ProductAmount, this.categoryList[i].CreatedDate]);
   }

   const excelModel = new ExportExcelModel();
   excelModel.Data = data;
   excelModel.FileName =  'danh-muc' + '_export_' + new Date().getTime() + '.xlsx';
   excelModel.Logo = await this.storeService.getStoreLogoBaseByToken();
   excelModel.Headers = headers;
   excelModel.Title = 'Danh mục mặt hàng';
   excelModel.ColumnWidths = [5, 40, 25, 15];
   this.excelService.generateExcel(excelModel);
 }

 // ** remove category */
  async removeCategory(cateId) {
    this.dialogService.showConfirm(AppMessage.APP_DIALOG_TITLE.CONFIRM, AppMessage.APP_DIALOG_MESSAGE.DELETE_CATEGORY, async () => {
      const result = await this.categoryService.removeCategory(cateId);
      if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.DELETE_CATEGORY, () => {
          this.destroyDataTable(this.tableId);
          this.fetchCategoryList(() => {
            this.applyDataTable(this.tableId);
          });
        });
      } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        });
      } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
      }
    });
  }

 // ** load category list and apply datatable js */
 private fetchCategoryList(updateUI) {
  this.categoryService.fetchCategoryList(() => {
      updateUI();
  });
}
}
