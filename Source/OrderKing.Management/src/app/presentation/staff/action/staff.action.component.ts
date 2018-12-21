import { Component } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';


declare var $;

@Component({
  selector: 'app-create-staff',
  templateUrl: './staff.action.view.html',
  styleUrls: ['./staff.action.style.scss']
})
export class StaffActionComponent extends BaseComponent {
  StaffInfo: UserInfoModel;
  ErrorMessage: string;
  ButtonContent: string;
  private staffId: string;
  AvatarUrl: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private router: Router,
     private storeService: StoreService, private authService: AuthService, userService: UserService) {
    super(userService);
    this.StaffInfo = new UserInfoModel();
    const currentDate = new Date();
    this.StaffInfo.JoinDate = currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear();
  }

  onInit() {
    this.AvatarUrl = '../../../../assets/images/no-avatar.png';
    this.staffId = this.getParam('id', this.activatedRoute);
    if (this.staffId !== null && this.staffId !== undefined) {
      this.titleService.setTitle('Order King - Chỉnh sửa thông tin nhân viên');
      this.getStaffInfo();
      this.ButtonContent = 'Chỉnh sửa';
    } else {
      this.titleService.setTitle('Order King - Tạo mới nhân viên');
      this.ButtonContent = 'Tạo mới';
    }
  }

  async onSubmit() {
    if (this.staffId === null || this.staffId === undefined) {
      await this.createNew();
    } else {
      await this.edit();
    }
  }

  private async getStaffInfo() {
    const iresult = await this.storeService.getStaffInfoById(this.staffId);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['']); // TODO display not found page
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
     this.authService.clearLoginSession();
     await this.gotoLogin(this.router);
    } else {
      this.StaffInfo = iresult.staffInfo;
    }
  }

  // ** Create new staff */
  async createNew() {
     const result = await this.storeService.addStaff(this.StaffInfo);
     if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
       this.router.navigate(['nhan-vien/chinh-sua', result]);
     } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.authService.clearLoginSession();
      await this.gotoLogin(this.router);
     }
  }

    // ** edit staff */
    async edit() {
      const result = await this.storeService.editStaff(this.StaffInfo);
      if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
        this.router.navigate(['nhan-vien/chinh-sua', result]);
      } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
       this.authService.clearLoginSession();
       await this.gotoLogin(this.router);
      }
   }

    onAvatarChanged(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => { // called once readAsDataURL is completed
      this.AvatarUrl = event.target.result;
    };
    reader.readAsDataURL(file);

   }
}
