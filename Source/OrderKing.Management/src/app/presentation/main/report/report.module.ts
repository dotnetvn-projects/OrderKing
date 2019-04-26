import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReportRevenueComponent } from './revenue/report.revenue.component';
import { ReportProductComponent } from './product/report.product.component';
import { ReportRoutes } from '../../../routing/report.routing';
import { UiComponentModule } from '../../_uicomponents/uicomponent.module';
import { DirectiveModule } from '../../_directives/directive.module';
import { PipeModule } from '../../_pipes/pipe.module';

@NgModule({
  declarations: [
    ReportRevenueComponent,
    ReportProductComponent
  ],
  imports: [
    RouterModule.forChild(ReportRoutes),
    UiComponentModule,
    CommonModule, FormsModule,
    DirectiveModule,
    PipeModule
  ],
  providers: [],
  bootstrap: [ReportRevenueComponent]
})
export class ReportModule { }
