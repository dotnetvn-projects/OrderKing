import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from 'src/app/model/product.model';
import { ProductService } from 'src/app/service/product.service';
import { Converter } from 'src/app/framework/framework.converter';
import { DialogService } from 'src/app/service/dialog.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { CategoryModel } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-action-product',
  templateUrl: './product.action.view.html',
  styleUrls: ['./product.action.style.scss']
})
export class ProductActionComponent extends BaseComponent {
  ProductInfo: ProductModel = new ProductModel();
  CategoryList: CategoryModel[];
  ImageUrl: string;
  ButtonContent: string;
  IsEdit: boolean;
  private productId: string;
  private imageData: any;

  constructor(
    private titleService: Title,
    private dialogService: DialogService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    injector: Injector
  ) {
    super(injector);
    this.ProductInfo.CreatedDate = Converter.ConvertCurrentDateToString();
  }

  async onInit() {
    this.CategoryList = await this.categoryService.getSelectedList();
    this.ImageUrl = AppSettings.APP_DEFAULT_IMAGE.DEFAULT_PRODUCT;

    // get id from url
    this.productId = this.getParam('id', this.activatedRoute);

    if (this.productId !== null && this.productId !== undefined) {
      this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.PRODUCT_UPDATE);
      this.getProductInfo();
      this.ButtonContent = AppMessage.APP_CONTROL_CONTENT.UPDATE;
      this.IsEdit = true;
    } else {
      this.ProductInfo.CategoryId = '0';
      this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.PRODUCT_CREATE);
      this.ButtonContent = AppMessage.APP_CONTROL_CONTENT.CREATE;
      this.IsEdit = false;
    }
  }

  async onSubmit() {
    if (this.ProductInfo.CategoryId === '0') {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SELECT_CATEGORY);
    } else {
      if (this.productId === null || this.productId === undefined) {
        await this.createNew();
      } else {
        this.ProductInfo.Id = this.productId;
        await this.edit();
      }
    }
  }

  // ** Create new category */
  async createNew() {
    const result = await this.productService.addProduct(this.ProductInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      if (this.imageData !== null && this.imageData !== undefined) {
        await this.productService.updateProductImage(this.imageData, result);
      }
      this.dialogService.showSuccess(
        AppMessage.APP_SUCCESS_MESSAGE.CREATE_PRODUCT,
        () => {
          this.router.navigate(['mat-hang/chinh-sua', result]);
        }
      );
    } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.dialogService.showError(
        AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT,
        () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        }
      );
    } else {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
    }
  }

  // ** edit product */
  async edit() {
    const result = await this.productService.editProduct(this.ProductInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      if (this.imageData !== null && this.imageData !== undefined) {
        await this.productService.updateProductImage(this.imageData, result);
      }

      this.dialogService.showSuccess(
        AppMessage.APP_SUCCESS_MESSAGE.UPDATE_PRODUCT,
        () => {
          this.router.navigate(['mat-hang/chinh-sua', result]);
        }
      );
    } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.dialogService.showError(
        AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT,
        () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        }
      );
    } else {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
    }
  }

  // ** Load product by id*/
  private async getProductInfo() {
    const iresult = await this.productService.getProductInfoById(this.productId);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['/page-not-found']); // TODO display not found page
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.authService.clearLoginSession();
      await this.gotoLogin(this.router);
    } else {
      this.ProductInfo = iresult.productInfo;
      this.ImageUrl = this.productService.getImageUrlById(this.productId);
    }
  }

  // **********************UI Updating***********************

  categorySelectChange(event) {
    this.ProductInfo.CategoryId = event.currentTarget.value;
  }

  // ** Handle upload image on view */
  onImageChanged(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      // called once readAsDataURL is completed
      this.ImageUrl = event.target.result;
      this.imageData = file;
    };
    reader.readAsDataURL(file);
  }

  // ************************End UI Updating**********************
}
