import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { StoreService } from 'src/app/service/store.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { StoreModel } from 'src/app/model/store.model';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { DialogService } from 'src/app/service/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store-action',
  templateUrl: './store.action.view.html',
  styleUrls: ['./store.action.style.scss']
})

export class StoreActionComponent extends BaseComponent {

  StoreInfo: StoreModel = new StoreModel();
  ImageData: any;
  ButtonContent: string;
  private storeId: string;

  constructor(private titleService: Title, private dialogService: DialogService, private activatedRoute: ActivatedRoute,
    private router: Router, private storeService: StoreService, injecttor: Injector ) {
     super(injecttor);
  }

  onInit() {
    // get id from url
    this.storeId = this.getParam('id', this.activatedRoute);
    this.StoreInfo.Image = AppSettings.APP_DEFAULT_IMAGE.NO_IMAGE;
    this.storeService.StoreInfo.subscribe(store => this.StoreInfo = store);
    this.storeService.fetchStoreInfo();

    this.ButtonContent = AppMessage.APP_CONTROL_CONTENT.UPDATE;
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STORE_UPDATE);
  }

  async onSubmit() {
    const result = await this.storeService.editStoreInfo(this.StoreInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      if (this.ImageData !== null && this.ImageData !== undefined) {
          await this.storeService.updateStoreLogo(this.ImageData);
      }

      this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.UPDATE_STORE,
        () => {
          this.router.navigate(['cua-hang']);
        });
    } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        });
    } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
    }
  }

  // **********************UI Updating***********************
   // ** Handle upload avatar on view */
   onImageChanged(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.StoreInfo.Image = event.target.result;
      this.ImageData = file;
    };
    reader.readAsDataURL(file);
   }
// ************************End UI Updating**********************
}
