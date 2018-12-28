import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.view.html',
  styleUrls: ['./category.style.scss']
})
export class CategoryComponent extends BaseComponent {

  constructor(private titleService: Title, injector: Injector ) {
    super(injector);
 }

 onInit() {
   this.titleService.setTitle('Order King - danh mục');
 }
}
