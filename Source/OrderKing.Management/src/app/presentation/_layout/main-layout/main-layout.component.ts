import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { SysNotifyService } from 'src/app/service/sysnotify.service';
import { SysNotifyFilterModel } from 'src/app/model/sysnotify/sysnotify.filter.model';
import { ListModel } from 'src/app/model/list.model';
import { SysNotifyModel } from 'src/app/model/sysnotify/sysnotify.model';
import { DialogService } from 'src/app/service/dialog.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
declare var $;
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.view.html',
  styleUrls: ['./main-layout.style.scss']
})
export class MainLayoutComponent extends BaseComponent {

  SysNotifyList: ListModel<SysNotifyModel> = new ListModel<SysNotifyModel>();

  constructor(private router: Router, injector: Injector,
    private sysNotifyService: SysNotifyService,
    private dialogService: DialogService) {
    super(injector);
    this.UserInfo = new UserInfoModel();
  }

  async onInit() {
    document.body.className = 'hold-transition skin-blue sidebar-mini fixed';
    $(document).ready(() => {
      const trees: any = $('[data-widget="tree"]');
      trees.tree();
      $('body').layout('fix');
    });
    window.dispatchEvent(new Event('resize'));
    this.userService.CurrentUserInfo.subscribe(userInfo => this.UserInfo = userInfo);
    this.sysNotifyService.NewSysNotifyList.subscribe(data => this.SysNotifyList = data);
    this.sysNotifyService.fetchNewSysNotifyList();
  }

  async logout() {
    const result = await this.authService.logout();
    if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
      await this.router.navigate(['dang-nhap']);
    } else {
      await this.router.navigate(['error']);
    }
  }

  // display sysnotify detail
  async showNotifyContent(id: string) {
    const iresult = await this.sysNotifyService.getSysNotifyInfoById(id);
    if (iresult.result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
    } else if (iresult.result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.authService.clearLoginSession();
      await this.gotoLogin(this.router);
    } else {
      this.dialogService.showInfo(iresult.sysNotifyInfo.Title, iresult.sysNotifyInfo.Content);
    }
  }
}
