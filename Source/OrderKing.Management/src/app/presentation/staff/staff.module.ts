import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  StaffComponent  } from './index/staff.component';
import { CreateStaffComponent } from './create/staff.create.component';
import { StaffRoutes } from '../../routing/staff.routing';

@NgModule({
  declarations: [
    StaffComponent,
    CreateStaffComponent
  ],
  imports: [
    RouterModule.forChild(StaffRoutes),
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [StaffComponent]
})
export class StaffModule { }
