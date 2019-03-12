import { AfterViewInit, EventEmitter, Output, Input, ElementRef, Renderer2, Directive } from '@angular/core';
declare var $;

@Directive({
    selector: '[appInputDateMask]',
})

export class InputDateMaskDirective implements AfterViewInit {

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
    // tslint:disable-next-line:no-input-rename
    // @Input('mask') mask: string;

    constructor(private el: ElementRef, private renderer: Renderer2) {

    }

  ngAfterViewInit() {
    const el = <HTMLInputElement>this.el.nativeElement;
    $(el).inputmask(
      {
        // 'alias': this.mask,
        'alias': 'dd/mm/yyyy',
        'oncomplete': () => {
          this.ngModelChange.emit(el.value);
        },
        'oncleared': () => {
          this.ngModelChange.emit(el.value);
        }
      });

  }
}
