import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { UserService } from 'src/app/service/user.service';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.view.html',
  styleUrls: ['./main-layout.style.scss']
})
export class MainLayoutComponent extends BaseComponent {

  constructor( private router: Router, private authService: AuthService, userService: UserService) {
    super(userService);
    this.UserInfo = new UserInfoModel();
  }

  async onInit() {
    const token = sessionStorage.getItem(AppSettings.TOKEN_KEY);
    if (token === undefined || token === null) {
     await this.router.navigate(['dang-nhap']);
    } else {
        const isExpired = await this.authService.isTokenExpired();
        if (isExpired) {
          await this.router.navigate(['dang-nhap']);
        } else {
            window.dispatchEvent(new Event('resize'));
            document.body.className = 'hold-transition skin-blue sidebar-mini';
            this.userService.CurrentUserInfo.subscribe(userInfo => this.UserInfo = userInfo);           
          }
        }
    }

  async logout() {
    const result = await this.authService.logout();
    if (result === AppSettings.RESPONSE_MESSAGE.ERROR) {
      await this.router.navigate(['dang-nhap']);
    } else {
      await this.router.navigate(['error']);
    }
  }
}
