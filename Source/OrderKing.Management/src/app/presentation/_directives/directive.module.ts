import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IcheckDirective } from './icheck/icheck.directive';
import { MustMatchDirective } from './must-match/must-match.directive';
import { DatatableDirective } from './datatable/datatable.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    IcheckDirective,
    MustMatchDirective,
    DatatableDirective
  ],
   exports: [IcheckDirective, MustMatchDirective, DatatableDirective]
})
export class DirectiveModule { }
