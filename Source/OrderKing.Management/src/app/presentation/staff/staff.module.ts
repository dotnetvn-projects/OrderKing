import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  StaffComponent  } from './index/staff.component';
import { StaffActionComponent } from './action/staff.action.component';
import { UiComponentModule } from '../_uicomponents/uicomponent.module';
import { StaffRoutes } from '../../routing/staff.routing';
import { DirectiveModule } from '../_directives/directive.module';


@NgModule({
  declarations: [
    StaffComponent,
    StaffActionComponent
  ],
  imports: [
    RouterModule.forChild(StaffRoutes),
    CommonModule, FormsModule, UiComponentModule, DirectiveModule
  ],
  providers: [],
  bootstrap: [StaffComponent]
})
export class StaffModule { }
