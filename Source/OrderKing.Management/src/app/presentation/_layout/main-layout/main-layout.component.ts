import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.view.html',
  styleUrls: ['./main-layout.style.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor( private router: Router, ) { }

  ngOnInit() {
    const token = sessionStorage.getItem('order-king-token');
    if (token === undefined || token === null) {
      this.router.navigate(['dang-nhap']);
    }
    window.dispatchEvent(new Event('resize'));
    document.body.className = 'hold-transition skin-blue sidebar-mini';
  }

}
