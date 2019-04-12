import { Component, OnInit, Input } from '@angular/core';
import { BaseItemModel } from '../../../../shared/models/base-item-model';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit {

  @Input() feedItem: BaseItemModel;

  constructor() { }

  ngOnInit() {
  }

}
