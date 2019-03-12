import { OnInit, EventEmitter, Output, Input, ElementRef, Renderer2, Directive, HostListener, AfterViewChecked } from '@angular/core';
import { CurrencyPipe } from '../../_pipes/currency/currency-pipe';
declare let $;

@Directive({
    selector: '[appInputCurrencyMask]',
})

export class InputCurrencyMaskDirective implements OnInit, AfterViewChecked {

  private el: HTMLInputElement;

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);

  constructor(
    private elementRef: ElementRef,
    private currencyPipe: CurrencyPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.formatCurrency($(this.el), '');
  }

  ngAfterViewChecked() {

    this.formatCurrency($(this.el), '');
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value) {
    this.formatCurrency($(this.el), '');
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    this.formatCurrency($(this.el), '');
   // this.ngModelChange.emit(this.val);
  }

  formatNumber(n) {
    // format number 1000000 to 1,234,567
    return n.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  formatCurrency(input, blur) {
    // appends $ to value, validates decimal side
    // and puts cursor back in right position.

    // get input value
    let input_val = input.val();

    // don't validate empty input
    if (input_val === '') { return; }

    // original length
    const original_len = input_val.length;

    // initial caret position
    let caret_pos = input.prop('selectionStart');

    // check for decimal
    if (input_val.indexOf('.') >= 0) {

      // get position of first decimal
      // this prevents multiple decimals from
      // being entered
      const decimal_pos = input_val.indexOf('.');

      // split number by decimal point
      let left_side = input_val.substring(0, decimal_pos);
      let right_side = input_val.substring(decimal_pos);

      // add commas to left side of number
      left_side = this.formatNumber(left_side);

      // validate right side
      right_side = this.formatNumber(right_side);

      // On blur make sure 2 numbers after decimal
      if (blur === 'blur') {
        right_side += '00';
      }

      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2);

      // join number by .
      input_val = '₫' + left_side + '.' + right_side;

    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = this.formatNumber(input_val);
      input_val = '₫' + input_val;

      // final formatting
      if (blur === 'blur') {
        input_val += '.00';
      }
    }

    // send updated string to input
    input.val(input_val);

    // put caret back in the right position
    const updated_len = input_val.length;
    caret_pos = updated_len - original_len + caret_pos;
    input[0].setSelectionRange(caret_pos, caret_pos);
  }
}
