import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MustMatchDirective } from './must-match/must-match.directive';

@NgModule({
  imports: [ CommonModule ],
  declarations: [
    MustMatchDirective
  ],
   exports: [MustMatchDirective]
})
export class DirectiveModule { }
