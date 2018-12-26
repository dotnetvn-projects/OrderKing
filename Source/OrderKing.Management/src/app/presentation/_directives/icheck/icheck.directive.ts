import { ElementRef, Directive } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[appIcheck]'
})

export class IcheckDirective {
    constructor(el: ElementRef) {
      $(() => {
        $('input[type="radio"].minimal').iCheck({
          radioClass   : 'iradio_minimal-green'
        }).on('ifChanged', function(event) {
          const c = event.target.value;
          alert(c);
        });
      });
    }
}

// $(() => {
//   $('input[type="radio"].minimal').iCheck({
//     radioClass   : 'iradio_minimal-green'
//   });
//   $('input').on('ifChecked', function(event) {
//     //   $(event.target.parent()).click();
//   });
// });
