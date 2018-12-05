import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './login.view.html',
  styleUrls: ['./login.style.scss']
})

export class LoginComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Order King - Đăng nhập hệ thống');
  }

  login() {
    this.router.navigate(['dashboard']);
  }
}
