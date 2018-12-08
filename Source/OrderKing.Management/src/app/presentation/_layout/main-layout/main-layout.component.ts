import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { UserService } from 'src/app/service/user.service';
import { BaseComponent } from 'src/app/framework/framework.base.component';

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
    const token = sessionStorage.getItem('order-king-token');
    if (token === undefined || token === null) {
     await this.router.navigate(['dang-nhap']);
    } else {
        const isExpired = await this.authService.isTokenExpired(token);
        if (isExpired) {
          await this.router.navigate(['dang-nhap']);
        } else {
            this.userService.CurrentUserInfo.subscribe(userInfo => this.UserInfo = userInfo);
            window.dispatchEvent(new Event('resize'));
            document.body.className = 'hold-transition skin-blue sidebar-mini';
          }
        }
    }
}
