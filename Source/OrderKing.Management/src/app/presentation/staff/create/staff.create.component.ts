import { Component } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';
import { AppSettings } from 'src/app/framework/framework.app.setting';

declare var $;

@Component({
  selector: 'app-create-staff',
  templateUrl: './staff.create.view.html',
  styleUrls: ['./staff.create.style.scss']
})
export class CreateStaffComponent extends BaseComponent {
  StaffInfo: UserInfoModel;
  ErrorMessage: string;

  constructor(private titleService: Title, private storeService: StoreService, userService: UserService) {
    super(userService);
  }

  onInit() {
    this.titleService.setTitle('Order King - Tạo mới nhân viên');
  }
}
