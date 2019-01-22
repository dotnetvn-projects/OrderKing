import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { StoreService } from 'src/app/service/store.service';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { StoreModel } from 'src/app/model/store.model';

@Component({
  selector: 'app-store',
  templateUrl: './store.view.html',
  styleUrls: ['./store.style.scss']
})

export class StoreComponent extends BaseComponent {

  StoreInfo: StoreModel;

  constructor(private titleService: Title, private storeService: StoreService, injecttor: Injector ) {
     super(injecttor);
  }

  onInit() {
    this.titleService.setTitle(AppMessage.APP_TITLE_MESSAGE.STORE);
    this.storeService.StoreInfo.subscribe(store => this.StoreInfo = store);
    this.storeService.fetchStoreInfo();
  }
}
