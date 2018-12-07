import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { WebClientService } from '../../service/webclient.service';
import { Dictionary } from '../../framework/objectextension/framework.dictionary';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashborad',
  templateUrl: './dashboard.view.html',
  styleUrls: ['./dashboard.style.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private titleService: Title, private webClient: WebClientService ) {

  }

  ngOnInit() {
    this.titleService.setTitle('Order King - Dashboard');
  }
}
