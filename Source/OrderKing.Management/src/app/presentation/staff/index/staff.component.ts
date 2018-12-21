import { Component } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';
import { AppSettings } from 'src/app/framework/framework.app.setting';

declare var $;

@Component({
  selector: 'app-staff',
  templateUrl: './staff.view.html',
  styleUrls: ['./staff.style.scss']
})
export class StaffComponent extends BaseComponent {
  StaffList: UserInfoModel[];

  constructor(private titleService: Title, private storeService: StoreService, userService: UserService) {
    super(userService);
  }

  onInit() {
    this.titleService.setTitle('Order King - danh sách nhân viên');
    this.storeService.StaffList.subscribe(staffList => this.StaffList = staffList);
    this.fetchUserList();
  }

  // remove member
  async removeStaff(staffId) {
    const result = await this.storeService.removeStaff(staffId);
    if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
      this.fetchUserList();
    } else {
      alert('Lỗi');
    }
  }

  // load member list and apply datatable js
  private fetchUserList() {
    this.storeService.fetchStaffList(() => {
      $(() => {
        $('#table-staff').DataTable();
      });
    });
  }
}
