import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/framework/framework.base.component';

@Component({
  selector: 'app-print-layout',
  templateUrl: './print-layout.view.html'
})
export class PrintLayoutComponent extends BaseComponent {

  constructor( private router: Router, injector: Injector) {
    super(injector);
  }
}
