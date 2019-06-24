import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  SysNotifyComponent } from './sysnotify.component';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { SysNptifyRoutes } from '../../../routing/sysnotify.routing';
@NgModule({
  declarations: [
    SysNotifyComponent
  ],
  imports: [
    RouterModule.forChild(SysNptifyRoutes),
    UiComponentModule,
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [SysNotifyComponent]
})
export class SysNotifyModule { }
