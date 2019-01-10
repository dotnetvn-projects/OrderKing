import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MustMatchDirective } from './must-match/must-match.directive';
import { InputMaskDirective } from './input-mask/input-mask.directive';


@NgModule({
  imports: [ CommonModule ],
  declarations: [
    InputMaskDirective,
    MustMatchDirective
  ],
   exports: [MustMatchDirective, InputMaskDirective]
})
export class DirectiveModule { }
