import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from '../../routing/dashboard.routing';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    RouterModule.forChild(DashboardRoutes),
    CommonModule, FormsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule { }
