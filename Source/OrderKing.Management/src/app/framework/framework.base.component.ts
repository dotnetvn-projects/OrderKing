import { OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { UserInfoModel } from '../model/userinfo.model';

export class BaseComponent implements OnInit {
    userService: UserService;
    UserInfo: UserInfoModel;

    constructor(userService: UserService) {
      this.userService = userService;
      this.UserInfo = new UserInfoModel();
    }

    ngOnInit() {
        this.onInit();
        this.userService.displayUserInfo();
      }

    onInit() {
        // code
    }
}
