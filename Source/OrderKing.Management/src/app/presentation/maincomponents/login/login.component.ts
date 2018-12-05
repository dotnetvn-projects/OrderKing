import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './login.view.html',
  styleUrls: ['./login.style.scss']
})
export class LoginComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Order King - Đăng nhập hệ thống');
  }


}
