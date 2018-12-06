import { Component, OnInit } from '@angular/core';
declare var $;

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.view.html',
  styleUrls: ['./login-layout.style.scss']
})
export class LoginLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.body.className = 'hold-transition login-page skin-blue login-background';
      $(() => {
          $('input').iCheck({
              checkboxClass: 'icheckbox_square-blue',
              radioClass: 'iradio_square-blue',
              increaseArea: '20%' /* optional */
          });
      });
  }

}
