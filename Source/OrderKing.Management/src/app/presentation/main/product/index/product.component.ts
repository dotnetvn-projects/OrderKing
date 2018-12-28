import { Component, Injector } from '@angular/core';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.view.html',
  styleUrls: ['./product.style.scss']
})
export class ProductComponent extends BaseComponent {

  constructor(private titleService: Title, injector: Injector ) {
    super(injector);
 }

 onInit() {
   this.titleService.setTitle('Order King - sản phẩm');
 }

}
