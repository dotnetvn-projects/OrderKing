import { OnInit, Injector } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserInfoModel } from '../model/userinfo.model';
declare var $;

export class BaseComponent implements OnInit {
  userService: UserService;
  UserInfo: UserInfoModel;

  constructor(private inject: Injector) {
    this.userService = this.inject.get(UserService);
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

  applyJs() {
    // code
  }

  applyDataTable(name) {
    $(() => {
      $('.' + name).dataTable();
    });
  }

  destroyDataTable(name) {
    $(() => {
      $('.' + name).dataTable().fnDestroy();
    });
  }
}
