import { AfterViewInit, EventEmitter, Output, Input, ElementRef, Renderer, Directive } from '@angular/core';
declare var $;

@Directive({
    selector: '[appInputMask]',
})

export class InputMaskDirective implements AfterViewInit {

    @Output() ngModelChange: EventEmitter<any> = new EventEmitter(false);
    // tslint:disable-next-line:no-input-rename
    @Input('mask') mask: string;

    constructor(private el: ElementRef, private renderer: Renderer) {

    }

  ngAfterViewInit() {
    const el = <HTMLInputElement>this.el.nativeElement;
    $(el).inputmask(
      {
        'alias': this.mask,
        'oncomplete': () => {
          this.ngModelChange.emit(el.value);
        },
        'oncleared': () => {
          this.ngModelChange.emit(el.value);
        }
      });

  }
}
