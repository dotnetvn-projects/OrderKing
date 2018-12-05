import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WebClientService } from '../../service/webclient.service';
import { Dictionary } from '../../framework/objectextension/dictionary';

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.style.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private titleService: Title, private webClient: WebClientService ) { }

  async ngOnInit() {
    this.titleService.setTitle('Order King - Dashboard');
    // const params = new Dictionary<string, any>();
    // params.put('AccessToken' , '92383a9844ad94af1bc4c3c078c42423d9f4d63637eb4620b929d333d19be4b38eb9198be63e5efa4287');
    // await this.webClient.doPostAsync('http://localhost:1337/api/public/user/get-info', params, null);

    // console.log(this.webClient.Result);
  }
}
