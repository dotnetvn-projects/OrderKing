import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from '../../../routing/dashboard.routing';
import { DirectiveModule } from '../../_directives/directive.module';
import { PipeModule } from '../../_pipes/pipe.module';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(DashboardRoutes),
    CommonModule, FormsModule, DirectiveModule, PipeModule, UiComponentModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
