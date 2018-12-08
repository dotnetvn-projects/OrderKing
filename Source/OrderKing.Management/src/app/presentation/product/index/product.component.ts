import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { UserService } from 'src/app/service/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.view.html',
  styleUrls: ['./product.style.scss']
})
export class ProductComponent extends BaseComponent {

  constructor(private titleService: Title, userService: UserService ) {
    super(userService);
 }

 onInit() {
   this.titleService.setTitle('Order King - sản phẩm');
 }

}
