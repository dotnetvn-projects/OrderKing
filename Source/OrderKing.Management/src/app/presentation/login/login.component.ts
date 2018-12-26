import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoginModel } from '../../model/login.model';
import { AuthService } from '../../service/auth.service';
import { UserService } from 'src/app/service/user.service';
import { AppSettings } from 'src/app/framework/framework.app.setting';
declare var $;

@Component({
  selector: 'app-login',
  templateUrl: './login.view.html',
  styleUrls: ['./login.style.scss']
})

export class LoginComponent implements OnInit {

  LoginInfo: LoginModel;
  ErrorMessage: string;

  constructor(private titleService: Title, private router: Router, private authService: AuthService, private userService: UserService) {
     this.LoginInfo = new LoginModel();
     this.ErrorMessage = '';
   }

   // because the layout is being used is not angular theme, so need to apply jquery
  applyJs() {
    $(() => {
      $('.icheck input').on('ifToggled', function (event) {
        $(this).val(event.target.checked);
        $('.icheck').trigger('click');
      });
    });
  }

  onCheckboxchange() {
     const isRemember = $('.icheck input').val();
     this.LoginInfo.RemeberMe = (isRemember === 'true');
   }

  async ngOnInit() {
    if (sessionStorage.getItem(AppSettings.TOKEN_KEY) === null) {
      this.applyJs();
      this.titleService.setTitle('Order King - Đăng nhập hệ thống');
    } else {
         await this.router.navigate(['dashboard']);
    }
  }

  async login() {
    if (this.LoginInfo.AccountName.trim().length <= 1 || this.LoginInfo.Password.trim().length <= 1 ) {
      this.ErrorMessage = 'Tài khoản hoặc mật không được trống !';
      return;
    }
    const result = await this.authService.login(this.LoginInfo);
    if (result === AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED) {
      this.ErrorMessage = 'Tài khoản đã bị khóa !';
    } else if (result === '') {
      this.ErrorMessage = 'Tài khoản hoặc mật khẩu không đúng !';
    } else {
      this.userService.fetchUserInfo();
      $(() => {
        window.location.href = '/dashboard';
      });
    }
  }
}
