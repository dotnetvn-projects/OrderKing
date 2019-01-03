import { Component, Injector } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { Router, ActivatedRoute } from '@angular/router';
import { Converter } from 'src/app/framework/framework.converter';
import { DialogService } from 'src/app/service/dialog.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';

declare var $;

@Component({
  selector: 'app-create-staff',
  templateUrl: './staff.action.view.html',
  styleUrls: ['./staff.action.style.scss']
})
export class StaffActionComponent extends BaseComponent {
  StaffInfo: UserInfoModel = new UserInfoModel();
  ErrorMessage: string;
  ButtonContent: string;
  AvatarUrl: string;
  IsEdit: boolean;
  private staffId: string;
  private avatarData: any;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private router: Router,
     private storeService: StoreService, injector: Injector,
     private dialogService: DialogService) {
    super(injector);
    this.StaffInfo.JoinDate = Converter.ConvertCurrentDateToString();
  }

  onInit() {
    this.AvatarUrl = AppSettings.APP_DEFAULT_IMAGE.DEFAULT_AVATAR;
    // get id from url
    this.staffId = this.getParam('id', this.activatedRoute);

    if (this.staffId !== null && this.staffId !== undefined) {
      this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STAFF_UPDATE);
      this.getStaffInfo();
      this.ButtonContent = AppMessage.APP_CONTROL_CONTENT.UPDATE;
      this.IsEdit = true;
    } else {
      this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STAFF_CREATE);
      this.ButtonContent =  AppMessage.APP_CONTROL_CONTENT.CREATE;
      this.IsEdit = false;
    }
  }

  // ** Form submit event */
  async onSubmit() {
    if (this.staffId === null || this.staffId === undefined) {
      await this.createNew();
    } else {
      this.StaffInfo.UserId = this.staffId;
      await this.edit();
    }
  }

  // ** Load staff info */
  private async getStaffInfo() {
    const iresult = await this.storeService.getStaffInfoById(this.staffId);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['/page-not-found']); // TODO display not found page
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.authService.clearLoginSession();
        await this.gotoLogin(this.router);
    } else {
      this.StaffInfo = iresult.staffInfo;
      if (this.StaffInfo.IsActived) {
        $('.staff-actived div').addClass('checked');
      } else {
        $('.staff-deactived div').addClass('checked');
      }
      this.StaffInfo.Password = '******';
      this.AvatarUrl = this.userService.getAvatarUrlByStaffId(this.staffId);
    }
  }

  // ** Create new staff */
  async createNew() {
     const result = await this.storeService.addStaff(this.StaffInfo);
     if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      if (this.avatarData !== null && this.avatarData !== undefined) {
          await this.storeService.updateStaffAvatar(this.avatarData, result);
       }
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.CREATE_STAFF,
          () => {
            this.router.navigate(['nhan-vien/chinh-sua', result]);
          });
     } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT,
          () => {
            this.authService.clearLoginSession();
            this.gotoLogin(this.router);
          });
     } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
     }
  }

    // ** edit staff */
    async edit() {
      const result = await this.storeService.editStaff(this.StaffInfo);
      if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
        if (this.avatarData !== null && this.avatarData !== undefined) {
            await this.storeService.updateStaffAvatar(this.avatarData, result);
        }
        if (this.StaffInfo.IsActived === false) {
            await this.storeService.lockStaff(result);
        } else {
            await this.storeService.unLockStaff(result);
        }
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.UPDATE_STAFF,
          () => {
            this.router.navigate(['nhan-vien/chinh-sua', result]);
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
    onAvatarChanged(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.AvatarUrl = event.target.result;
      this.avatarData = file;
    };
    reader.readAsDataURL(file);
   }

  // App event and jquery for custom radio button
  applyJs () {
    $(() => {
      $('input[type="radio"].minimal').iCheck({
        radioClass   : 'iradio_minimal-green'
      }).on('ifChecked', function (event) {
        $(this).val(event.target.value);
        if (event.target.id === 'staffactived') {
          $('.staff-actived').trigger('click');
        } else {
          $('.staff-deactived').trigger('click');
        }
      });
    });
  }

  // capture event when user clicks on status radio butoon
  onRadioButtonchange(isactived: boolean) {
     this.StaffInfo.IsActived = isactived;
  }
// ************************End UI Updating**********************
}
