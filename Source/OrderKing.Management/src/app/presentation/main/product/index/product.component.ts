import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { ProductModel } from 'src/app/model/product.model';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/service/dialog.service';
import { ProductService } from 'src/app/service/product.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { CategoryModel } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/service/category.service';
import { ExportExcelModel } from 'src/app/model/export.excel.model';
import { StoreService } from 'src/app/service/store.service';
import { ExcelService } from 'src/app/service/export.excel.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.view.html',
  styleUrls: ['./product.style.scss']
})
export class ProductComponent extends BaseComponent {
  ProductList: ProductModel[];
  private tableId = 'table-product';
  CategoryList: CategoryModel[];
  SelectedCategoryId: string;

  constructor(private titleService: Title, private dialogService: DialogService,
    private router: Router, private categoryService: CategoryService, private storeService: StoreService,
    private productService: ProductService, private excelService: ExcelService, injector: Injector) {
    super(injector);
  }

  async onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.PRODUCT);
    this.productService.ProductList.subscribe(productList => this.ProductList = productList);
    this.fetchProductList(() => {
      this.applyDataTable(this.tableId);
    });
    this.CategoryList = await this.categoryService.getSelectedList();
    this.SelectedCategoryId = this.CategoryList[0].Id;
  }

  // ** export excel */
  async exportExcel() {
    const headers =  ['STT', 'Mã mặt hàng', 'Tên mặt hàng', 'Danh mục', 'Đơn giá', 'Tồn kho', 'Mô tả', 'Ngày tạo'];
    const data = [];

    for (let i = 0 ; i < this.ProductList.length ; i++) {
     data.push([(i + 1), this.ProductList[i].ProductCode, this.ProductList[i].ProductName, this.ProductList[i].CategoryName,
                         this.ProductList[i].Price, this.ProductList[i].InStock,
                         this.ProductList[i].Description, this.ProductList[i].CreatedDate]);
    }

    const excelModel = new ExportExcelModel();
    excelModel.Data = data;
    excelModel.FileName =  'mat-hang' + '_export_' + new Date().getTime() + '.xlsx';
    excelModel.Logo = await this.storeService.getStoreLogoBaseByToken();
    excelModel.Headers = headers;
    excelModel.Title = 'Danh sách mặt hàng';
    excelModel.ColumnWidths = [5, 20, 40, 20, 15, 15, 40, 20];
    this.excelService.generateExcel(excelModel);
  }

  // ** remove product */
  async removeProduct(productId) {
    this.dialogService.showConfirm(AppMessage.APP_DIALOG_TITLE.CONFIRM, AppMessage.APP_DIALOG_MESSAGE.DELETE_PRODUCT, async () => {
      const result = await this.productService.removeProduct(productId);
      if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.DELETE_PRODUCT, () => {
          this.destroyDataTable(this.tableId);
          this.fetchProductList(() => {
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

  // ** load product list and apply datatable js */
  private fetchProductList(updateUI) {
    this.productService.fetchProductList(() => {
      updateUI();
    });
  }

  // ** load product list by categỏy and apply datatable js */
  private fetchProductListByCategory(updateUI) {
    this.productService.fetchProductListBycate(this.SelectedCategoryId, () => {
      updateUI();
    });
  }

  categorySelectChange(event) {
    this.SelectedCategoryId = event.currentTarget.value;
    this.destroyDataTable(this.tableId);
    if (this.SelectedCategoryId === '0') {
      this.fetchProductList(() => {
        this.applyDataTable(this.tableId);
      });
    } else {
      this.fetchProductListByCategory(() => {
        this.applyDataTable(this.tableId);
      });
    }
  }
}
