import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiComponentModule } from '../../presentation/_uicomponents/uicomponent.module';
import {  StaffComponent  } from './index/staff.component';
import { StaffActionComponent } from './action/staff.action.component';
import { StaffRoutes } from '../../routing/staff.routing';


@NgModule({
  declarations: [
    StaffComponent,
    StaffActionComponent
  ],
  imports: [
    UiComponentModule,
    RouterModule.forChild(StaffRoutes),
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [StaffComponent]
})
export class StaffModule { }
