import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {Router} from '@angular/router';
declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './login.view.html',
  styleUrls: ['./login.style.scss']
})

export class LoginComponent implements OnInit {

  constructor(private titleService: Title, private router: Router) { }

  ngOnInit() {
    this.titleService.setTitle('Order King - Đăng nhập hệ thống');
    document.body.className = 'hold-transition login-page skin-blue';
      $(() => {
          $('input').iCheck({
              checkboxClass: 'icheckbox_square-blue',
              radioClass: 'iradio_square-blue',
              increaseArea: '20%' /* optional */
          });
      });
  }

  login() {
    this.router.navigate(['dashboard']);
  }
}
