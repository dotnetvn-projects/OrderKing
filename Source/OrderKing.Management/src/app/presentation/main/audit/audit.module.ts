import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuditComponent } from './audit.component';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { AuditRoutes } from '../../../routing/audit.routing';
@NgModule({
  declarations: [
    AuditComponent
  ],
  imports: [
    RouterModule.forChild(AuditRoutes),
    UiComponentModule,
    CommonModule, FormsModule
  ],
  providers: [],
  bootstrap: [AuditComponent]
})
export class AuditModule { }
