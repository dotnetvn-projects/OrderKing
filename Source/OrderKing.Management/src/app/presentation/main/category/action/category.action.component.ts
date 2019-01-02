import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from 'src/app/model/category.model';
import { CategoryService } from 'src/app/service/category.service';
import { Converter } from 'src/app/framework/framework.converter';
import { DialogService } from 'src/app/service/dialog.service';

@Component({
  selector: 'app-action-category',
  templateUrl: './category.action.view.html',
  styleUrls: ['./category.action.style.scss']
})
export class CategoryActionComponent extends BaseComponent {

  CategoryInfo: CategoryModel = new CategoryModel();
  ImageUrl: string;
  ButtonContent: string;
  IsEdit: boolean;
  private cateId: string;
  private imageData: any;

  constructor(private titleService: Title, private dialogService: DialogService, private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute, private router: Router, injector: Injector) {
    super(injector);
    this.CategoryInfo.CreatedDate = Converter.ConvertCurrentDateToString();
  }

  onInit() {
    this.ImageUrl = AppSettings.APP_DEFAULT_IMAGE.NO_IMAGE;
    // get id from url
    this.cateId = this.getParam('id', this.activatedRoute);

    if (this.cateId !== null && this.cateId !== undefined) {
      this.titleService.setTitle(AppSettings.APP_TITLE_MESSAGE.CATEGORY_UPDATE);
      this.getCategoryInfo();
      this.ButtonContent = AppSettings.APP_CONTROL_CONTENT.UPDATE;
      this.IsEdit = true;
    } else {
      this.titleService.setTitle(AppSettings.APP_TITLE_MESSAGE.CATEGORY_CREATE);
      this.ButtonContent =  AppSettings.APP_CONTROL_CONTENT.CREATE;
      this.IsEdit = false;
    }
  }

  async onSubmit() {
    if (this.cateId === null || this.cateId === undefined) {
      await this.createNew();
    } else {
      this.CategoryInfo.Id = this.cateId;
      await this.edit();
    }
  }

  // ** Create new category */
  async createNew() {
    const result = await this.categoryService.addCategory(this.CategoryInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
     if (this.imageData !== null && this.imageData !== undefined) {
         await this.categoryService.updateCategoryImage(this.imageData, result);
      }
       this.dialogService.showSuccess(AppSettings.APP_SUCCESS_MESSAGE.CREATE_CATEGORY,
         () => {
           this.router.navigate(['danh-muc/chinh-sua', result]);
         });
    } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
       this.dialogService.showError(AppSettings.APP_ERROR_MESSAGE.SESSION_TIMEOUT,
         () => {
           this.authService.clearLoginSession();
           this.gotoLogin(this.router);
         });
    } else {
       this.dialogService.showError(AppSettings.APP_ERROR_MESSAGE.BUSY);
    }
 }

   // ** edit category */
   async edit() {
     const result = await this.categoryService.editCategory(this.CategoryInfo);
     if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
       if (this.imageData !== null && this.imageData !== undefined) {
           await this.categoryService.updateCategoryImage(this.imageData, result);
       }

       this.dialogService.showSuccess(AppSettings.APP_SUCCESS_MESSAGE.UPDATE_CATEGORY,
         () => {
           this.router.navigate(['danh-muc/chinh-sua', result]);
         });
     } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
         this.dialogService.showError(AppSettings.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
           this.authService.clearLoginSession();
           this.gotoLogin(this.router);
         });
     } else {
         this.dialogService.showError(AppSettings.APP_ERROR_MESSAGE.BUSY);
     }
  }

  // ** Load category by id*/
  private async getCategoryInfo() {
    const iresult = await this.categoryService.getCategoryInfoById(this.cateId);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['/page-not-found']); // TODO display not found page
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.authService.clearLoginSession();
        await this.gotoLogin(this.router);
    } else {
      this.CategoryInfo = iresult.cateInfo;
      this.ImageUrl = this.categoryService.getImageUrlByCateId(this.cateId);
    }
  }

  // **********************UI Updating***********************
   // ** Handle upload image on view */
   onImageChanged(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.ImageUrl = event.target.result;
      this.imageData = file;
    };
    reader.readAsDataURL(file);
   }

// ************************End UI Updating**********************
}

