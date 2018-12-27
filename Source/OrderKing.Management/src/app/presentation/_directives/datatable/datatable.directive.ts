import { ElementRef, Directive, OnInit } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[appDatatable]'
})

export class DatatableDirective {
    constructor(private el: ElementRef) {
    }
}

