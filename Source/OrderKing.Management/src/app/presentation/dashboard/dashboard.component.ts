import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.style.scss']
})

export class DashboardComponent extends BaseComponent {

  constructor(private titleService: Title, userService: UserService ) {
     super(userService);
  }

  onInit() {
    this.titleService.setTitle('Order King - Dashboard');
  }
}
