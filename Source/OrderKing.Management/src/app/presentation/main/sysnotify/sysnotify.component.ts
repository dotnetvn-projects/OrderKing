import { Component, Injector, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { DialogService } from 'src/app/service/dialog.service';
import { Router } from '@angular/router';
import { AppMessage } from 'src/app/framework/framework.app.messages';
import { AppSettings } from 'src/app/framework/framework.app.setting';
import { PaginationComponent } from 'src/app/presentation/_uicomponents/pagination/pagination.component';
import { SysNotifyService } from 'src/app/service/sysnotify.service';
import { ListModel } from 'src/app/model/list.model';
import { SysNotifyGroupModel } from 'src/app/model/sysnotify/sysnotify.group.model';
import { SysNotifyFilterModel } from 'src/app/model/sysnotify/sysnotify.filter.model';

@Component({
  selector: 'app-sysnotify',
  templateUrl: './sysnotify.view.html',
  styleUrls: ['./sysnotify.style.scss']
})

export class SysNotifyComponent extends BaseComponent {

  SysNotifyList: ListModel<SysNotifyGroupModel> = new ListModel<SysNotifyGroupModel>();
  SysNotifyFilter: SysNotifyFilterModel = new SysNotifyFilterModel();

  @ViewChild('NotifyPagerContainer', { read: ViewContainerRef }) notifyViewContainerRef: ViewContainerRef;
  private notifyPagerComponent: any;

  constructor(private titleService: Title,
    private sysNotifyService: SysNotifyService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private dialogService: DialogService,
    private router: Router,
    injector: Injector) {
    super(injector);
  }


  // init component
  onInit() {
    this.sysNotifyService.SysNotifyList.subscribe(data => this.SysNotifyList = data);
    this.loadNotifyList();
  }

  // load notify list
  loadNotifyList() {
    this.sysNotifyService.fetchSysNotifyList(this.SysNotifyFilter, () => {
      this.loadNotifyPager();
    });
  }

  loadNotifyPager() {
    // load pager dynamic
    if (this.notifyPagerComponent == null) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
      this.notifyPagerComponent = this.notifyViewContainerRef.createComponent(factory);
      this.notifyPagerComponent.instance.PageChange.subscribe((event) => {
        this.SysNotifyFilter.PageNumber = event;
        this.loadNotifyList();
      });
    }

    this.notifyPagerComponent.instance.Css = 'pagination no-margin pull-right';
    this.notifyPagerComponent.instance.PageSize = this.SysNotifyFilter.PageSize;
    this.notifyPagerComponent.instance.TotalPage = this.SysNotifyList.TotalRecord;
    this.notifyPagerComponent.changeDetectorRef.detectChanges();
  }

}
