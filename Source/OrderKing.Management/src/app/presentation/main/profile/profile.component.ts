import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/service/dialog.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { UserService } from 'src/app/service/user.service';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/user/userinfo.model';
import { PasswordInfoModel } from 'src/app/model/user/passwordInfo.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.view.html',
  styleUrls: ['./profile.style.scss']
})

export class ProfileComponent extends BaseComponent {

  AvatarUrl: string;
  private avatarData: any;
  PasswordInfo: PasswordInfoModel;

  constructor(private titleService: Title, private dialogService: DialogService,
    private storeService: StoreService,
    private router: Router, injector: Injector) {
    super(injector);
    this.PasswordInfo = new PasswordInfoModel();
  }

  async onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.PROFILE);
    this.AvatarUrl = this.userService.getCurrentAvatarUrl();
    this.userService.CurrentUserInfo.subscribe(userInfo => this.UserInfo = userInfo);
  }

  async onSubmit() {

    const checkEmail = await this.userService.isExistEmail(this.UserInfo.Email);
    if (checkEmail !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.EMAIL_EXIST);
      return;
    }

    const checkPhone = await this.userService.isExistPhoneNumber(this.UserInfo.PhoneNumber);
    if (checkPhone !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.PHONE_EXIST);
      return;
    }

    const checkIdentity = await this.userService.isExistIdentityCard(this.UserInfo.IdentityCard);
    if (checkIdentity !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.IDENTITYCARD_EXIST);
      return;
    }

    const result = await this.userService.editUserInfo(this.UserInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      if (this.avatarData !== null && this.avatarData !== undefined) {
          await this.userService.updateAvatar(this.avatarData);
      }

      this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.UPDATE_STAFF, () => {
        this.userService.fetchUserInfo();
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

  async onSubmitChangePass() {

    const serverPassResult = await this.userService.isSameServerPass(this.PasswordInfo);
    if (serverPassResult ===  AppSettings.RESPONSE_MESSAGE.SUCCESS) {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.PASSWORD_SERVER_DIFF);
      return;
    }

    if (this.PasswordInfo.NewPassword !== this.PasswordInfo.TemPassword) {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.PASSWORD_DIFF);
      return;
    }

    const result = await this.userService.changePassword(this.PasswordInfo);
    if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.UPDATE_PASSWORD, null);
    } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        });
    } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
    }
  }

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

}
