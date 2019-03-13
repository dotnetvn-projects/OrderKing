import { Component, OnInit, OnDestroy, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/framework/framework.base.component';
import { UserService } from 'src/app/service/user.service';
declare var $;

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.style.scss']
})

export class DashboardComponent extends BaseComponent {
  private tableId = 'table-top-sell';

  constructor(private titleService: Title, injecttor: Injector ) {
     super(injecttor);
  }

  applyJs() {
    $(() => {
      const bar_data = {
        data : [['January', 10], ['February', 8], ['March', 4], ['April', 13], ['May', 17], ['June', 9], ['July', 30]],
        color: '#3c8dbc'
      };

      $.plot('#bar-chart', [bar_data], {
        grid  : {
          borderWidth: 1,
          borderColor: '#f3f3f3',
          tickColor  : '#f3f3f3'
        },
        series: {
          bars: {
            show    : true,
            barWidth: 0.5,
            align   : 'center'
          }
        },
        xaxis : {
          mode      : 'categories',
          tickLength: 0
        }
      });
    });
  }

  onInit() {
    this.titleService.setTitle('Order King - Dashboard');
    this.applyDataTable(this.tableId);
  }

}
