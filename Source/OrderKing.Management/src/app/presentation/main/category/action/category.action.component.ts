import { Component, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { AppSettings } from 'src/app/framework/framework.app.setting';

@Component({
  selector: 'app-action-category',
  templateUrl: './category.action.view.html',
  styleUrls: ['./category.action.style.scss']
})
export class CategoryActionComponent extends BaseComponent {

  constructor(private titleService: Title, injector: Injector) {
    super(injector);
  }

  onInit() {
    this.titleService.setTitle(AppSettings.APP_TITLE_MESSAGE.CATEGORY);
  }
}

