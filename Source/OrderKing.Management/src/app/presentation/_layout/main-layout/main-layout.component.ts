import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';
declare var $;
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.view.html',
  styleUrls: ['./main-layout.style.scss']
})
export class MainLayoutComponent extends BaseComponent {

  constructor( private router: Router, private authService: AuthService, injector: Injector) {
    super(injector);
    this.UserInfo = new UserInfoModel();
  }

  async onInit() {
      window.dispatchEvent(new Event('resize'));
      document.body.className = 'hold-transition skin-blue sidebar-mini fixed';
      $(document).ready(() => {
        const trees: any = $('[data-widget="tree"]');
        trees.tree();
      });
      this.userService.CurrentUserInfo.subscribe(userInfo => this.UserInfo = userInfo);
    }

  async logout() {
    const result = await this.authService.logout();
    if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
      await this.router.navigate(['dang-nhap']);
    } else {
      await this.router.navigate(['error']);
    }
  }
}
