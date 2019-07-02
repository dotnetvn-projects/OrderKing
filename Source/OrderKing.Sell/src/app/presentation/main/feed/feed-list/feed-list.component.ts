import { Component, OnInit, Input } from '@angular/core';
import { BaseItemModel } from '../../../shared/models/base-item-model';
import { ProductItem } from '../../../shared/models/product/product-item';
import { ItemContentType } from '../../../shared/commons/enums/item-content-type';

@Component({
  selector: 'app-feed-list',
  styleUrls: ['./feed-list.component.css'],
  templateUrl: './feed-list.component.html'
})
export class FeedListComponent implements OnInit {

  @Input() pageSize: number;

  feeds: BaseItemModel[];

  constructor() { }

  ngOnInit() {
    const feedList: BaseItemModel[] = [];

    const listProduct: BaseItemModel[] = [];
    this.pageSize = this.pageSize === null || this.pageSize === undefined ? 20 : this.pageSize;
    for (let i = 0; i < this.pageSize; i++) {
      const product = new ProductItem({
        thumbnailUrl: 'assets/photos/peach.png',
        description: '',
        name: 'Đào ngâm thuốc sáu tháng không hư',
        id: i.toString(),
        createdDate: '4/12/2018',
        price: 8 * (i + 1) * 1000,
        url: '/product/detail/1',
        updatedDate: '4/12/2018',
      });

      listProduct.push(product);
    }

    this.feeds = [...listProduct];
  }
}
