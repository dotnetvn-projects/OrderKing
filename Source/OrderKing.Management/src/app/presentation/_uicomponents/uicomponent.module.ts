import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    PaginationComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  entryComponents: [ PaginationComponent ],
  exports: [BreadcrumbComponent, PaginationComponent]
})
export class UiComponentModule {}
