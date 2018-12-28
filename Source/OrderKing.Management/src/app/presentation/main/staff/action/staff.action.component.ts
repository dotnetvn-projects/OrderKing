import { Component, Injector } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
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
  StaffInfo: UserInfoModel = new UserInfoModel();
  ErrorMessage: string;
  ButtonContent: string;
  AvatarUrl: string;
  IsEdit: boolean;
  private staffId: string;
  private avatarData: any;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private router: Router,
     private storeService: StoreService, private authService: AuthService, injector: Injector) {
    super(injector);
    const currentDate = new Date();
    this.StaffInfo.JoinDate = currentDate.getDate() + '/' + currentDate.getMonth() + '/' + currentDate.getFullYear();
  }

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

  onRadioButtonchange(isactived: boolean) {
     this.StaffInfo.IsActived = isactived;
  }

  onInit() {
    this.AvatarUrl = '../../../../assets/images/no-avatar.png';
    this.staffId = this.getParam('id', this.activatedRoute);

    if (this.staffId !== null && this.staffId !== undefined) {
      this.titleService.setTitle('Order King - Chỉnh sửa thông tin nhân viên');
      this.getStaffInfo();
      this.ButtonContent = 'Chỉnh sửa';
      this.IsEdit = true;
    } else {
      this.titleService.setTitle('Order King - Tạo mới nhân viên');
      this.ButtonContent = 'Tạo mới';
      this.IsEdit = false;
    }
  }

  async onSubmit() {
    if (this.staffId === null || this.staffId === undefined) {
      await this.createNew();
    } else {
      this.StaffInfo.UserId = this.staffId;
      await this.edit();
    }
  }

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
        if (this.avatarData !== null && this.avatarData !== undefined) {
          await this.storeService.updateStaffAvatar(this.avatarData, result);
        }
        if (this.StaffInfo.IsActived === false) {
          await this.storeService.lockStaff(result);
        } else {
          await this.storeService.unLockStaff(result);
        }
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
      this.avatarData = file;
    };
    reader.readAsDataURL(file);
   }
}
