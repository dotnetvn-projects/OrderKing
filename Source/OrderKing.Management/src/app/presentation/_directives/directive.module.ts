import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IcheckDirective } from './icheck/icheck.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    IcheckDirective
  ],
   exports: [IcheckDirective]
})
export class DirectiveModule { }
