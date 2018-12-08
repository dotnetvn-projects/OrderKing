import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.view.html',
  styleUrls: ['./category.style.scss']
})
export class CategoryComponent extends BaseComponent {

  constructor(private titleService: Title, userService: UserService ) {
    super(userService);
 }

 onInit() {
   this.titleService.setTitle('Order King - danh mục');
 }
}