import { OnInit, Injector } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserInfoModel } from '../model/user/userinfo.model';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
declare var $;

export class BaseComponent implements OnInit {
  userService: UserService;
  authService: AuthService;
  UserInfo: UserInfoModel;

  constructor(private inject: Injector) {
    this.userService = this.inject.get(UserService);
    this.authService = this.inject.get(AuthService);
    this.UserInfo = new UserInfoModel();
  }

  ngOnInit() {
    this.onInit();
    this.applyJs();
    this.userService.displayUserInfo();
  }

  onInit() {
    // code
  }

  // reload page
  reload() {
// tslint:disable-next-line: deprecation
    window.location.reload(true);
  }

  gotoLogin(router) {
    router.navigate(['dang-nhap']);
  }

  getParam(name: string, activatedRoute) {
    try {
      return activatedRoute.snapshot.params[name];
    } catch (ex) {
      return null;
    }
  }

  getUrl(router: Router) {
     return router.url;
  }

  applyJs() {
    // code
  }

  applyDataTable(name) {
    $(() => {
      $('#' + name).dataTable();
    });
  }

  destroyDataTable(name) {
    $(() => {
      $('#' + name).dataTable().fnDestroy();
    });
  }
}
