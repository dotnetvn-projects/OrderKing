import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MustMatchDirective } from './must-match/must-match.directive';
import { InputDateMaskDirective } from './input-mask/input-date-mask.directive';
import { InputCurrencyMaskDirective } from './input-mask/input-currency-mask-directive';


@NgModule({
  imports: [ CommonModule ],
  declarations: [
    InputDateMaskDirective,
    MustMatchDirective,
    InputCurrencyMaskDirective
  ],
   exports: [MustMatchDirective, InputDateMaskDirective, InputCurrencyMaskDirective]
})
export class DirectiveModule { }
