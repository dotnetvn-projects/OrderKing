import { Component, OnInit } from '@angular/core';
import { StaffService } from 'src/app/service/staff.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/service/user.service';

declare var $;

@Component({
  selector: 'app-staff',
  templateUrl: './staff.view.html',
  styleUrls: ['./staff.style.scss']
})
export class StaffComponent extends BaseComponent {

  StaffList: UserInfoModel[];

  constructor(private titleService: Title, private staffService: StaffService, userService: UserService ) {
    super(userService);
  }

  onInit() {
    $(() => {
      $('#example1').DataTable();
      $('#example2').DataTable({
        'paging'      : true,
        'lengthChange': false,
        'searching'   : false,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false
      });
    });
    this.staffService.StaffList.subscribe(staffList => this.StaffList = staffList);
    this.staffService.fetchStaffList();
  }
}
