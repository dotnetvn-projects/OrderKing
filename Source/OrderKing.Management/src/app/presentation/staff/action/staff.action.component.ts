import { Component } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { Router, ActivatedRoute } from '@angular/router';


declare var $;

@Component({
  selector: 'app-create-staff',
  templateUrl: './staff.action.view.html',
  styleUrls: ['./staff.action.style.scss']
})
export class StaffActionComponent extends BaseComponent {
  StaffInfo: UserInfoModel;
  ErrorMessage: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private router: Router,
     private storeService: StoreService, userService: UserService) {
    super(userService);
    this.StaffInfo = new UserInfoModel();
  }

  onInit() {
    const t = this.activatedRoute.snapshot.params.get('id');
    this.titleService.setTitle('Order King - Tạo mới nhân viên');
  }

  // ** Create new staff */
  async createNew() {
     const result = await this.storeService.addStaff(this.StaffInfo);
     if (result !== AppSettings.RESPONSE_MESSAGE.ERROR) {
      this.router.navigate(['nhan-vien/chinh-sua', {id: result}]);
     } else {
       alert('â');
     }
  }
}
