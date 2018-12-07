import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginModel } from '../../model/login.model';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.view.html',
  styleUrls: ['./login.style.scss']
})

export class LoginComponent implements OnInit {

  LoginInfo: LoginModel;
  ErrorMessage: string;

  constructor(private titleService: Title, private router: Router, private authService: AuthService) {
     this.LoginInfo = new LoginModel();
     this.ErrorMessage = '';
   }

  ngOnInit() {
    this.titleService.setTitle('Order King - Đăng nhập hệ thống');
  }

  async login() {
    if (this.LoginInfo.AccountName.trim().length <= 1 || this.LoginInfo.Password.trim().length <= 1 ) {
      this.ErrorMessage = 'Tài khoản hoặc mật thông không được trống !';
      return;
    }
    const result = await this.authService.login(this.LoginInfo);
    if (result === 'unauthorized') {
      this.ErrorMessage = 'Tài khoản đã bị khóa !';
    } else if (result === '') {
      this.ErrorMessage = 'Tài khoản hoặc mật khẩu không đúng !';
    } else {
      this.router.navigate(['dashboard']);
    }
  }
}
