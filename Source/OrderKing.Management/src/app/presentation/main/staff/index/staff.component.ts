import { Component, Injector } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.view.html',
  styleUrls: ['./staff.style.scss']
})
export class StaffComponent extends BaseComponent {
  StaffList: UserInfoModel[];
  private tableId = 'table-staff';

  constructor(private titleService: Title, private storeService: StoreService, injector: Injector,
    private dialogService: DialogService, private router: Router) {
    super(injector);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STAFF);
    this.storeService.StaffList.subscribe(staffList => this.StaffList = staffList);
    this.fetchUserList(() => {
     this.applyDataTable(this.tableId);
    });
  }

  // ** remove staff */
  async removeStaff(staffId) {
    this.dialogService.showConfirm(AppMessage.APP_DIALOG_TITLE.CONFIRM, AppMessage.APP_DIALOG_MESSAGE.DELETE_STAFF, async () => {
      const result = await this.storeService.removeStaff(staffId);
      if (result === AppSettings.RESPONSE_MESSAGE.SUCCESS) {
        this.dialogService.showSuccess(AppMessage.APP_SUCCESS_MESSAGE.DELETE_STAFF, () => {
          this.destroyDataTable(this.tableId);
          this.fetchUserList(() => {
            this.applyDataTable(this.tableId);
          });
        });
      } else if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.SESSION_TIMEOUT, () => {
          this.authService.clearLoginSession();
          this.gotoLogin(this.router);
        });
      } else {
        this.dialogService.showError(AppMessage.APP_ERROR_MESSAGE.BUSY);
      }
    });
  }

  // ** load staff list and apply datatable js */
  private fetchUserList(updateUI) {
    this.storeService.fetchStaffList(() => {
        updateUI();
    });
  }
}
