import { Component, Injector } from '@angular/core';
import { StoreService } from 'src/app/service/store.service';
import { UserInfoModel } from 'src/app/model/userinfo.model';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { ExcelService } from 'src/app/service/export.excel.service';
import { ExportExcelModel } from 'src/app/model/export.excel.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.view.html',
  styleUrls: ['./staff.style.scss']
})
export class StaffComponent extends BaseComponent {
  StaffList: UserInfoModel[];
  private tableId = 'table-staff';

  constructor(private titleService: Title, private storeService: StoreService, injector: Injector,
    private dialogService: DialogService, private excelService: ExcelService, private router: Router) {
    super(injector);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STAFF);
    this.storeService.StaffList.subscribe(staffList => this.StaffList = staffList);
    this.fetchUserList(() => {
     this.applyDataTable(this.tableId);
    });
  }

  // ** export excel */
  async exportExcel() {
    const headers =  ['STT', 'Họ và tên', 'Điện thoại', 'Địa chỉ thường trú',
                     'Địa chỉ tạm trú', 'Số CMND', 'Email' , 'Ngày tạo', 'Trạng thái'];
    const data = [];

    for (let i = 0 ; i < this.StaffList.length ; i++) {
     let status = 'Kích hoạt';
     if (!this.StaffList[i].IsActived) {
        status = 'Khóa';
     }
     data.push([(i + 1), this.StaffList[i].FullName, this.StaffList[i].PhoneNumber,
           this.StaffList[i].Address, this.StaffList[i].Address2, this.StaffList[i].IdentityCard,
           this.StaffList[i].Email, this.StaffList[i].CreatedDate, status]);
    }

    const excelModel = new ExportExcelModel();
    excelModel.Data = data;
    excelModel.FileName =  'nhan-vien' + '_export_' + new Date().getTime() + '.xlsx';
    excelModel.Logo = await this.storeService.getStoreLogoBaseByToken();
    excelModel.Headers = headers;
    excelModel.Title = 'Danh sách nhân viên';
    excelModel.ColumnWidths = [5, 30, 20, 40, 40, 20, 25, 15, 15];
    this.excelService.generateExcel(excelModel);
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
