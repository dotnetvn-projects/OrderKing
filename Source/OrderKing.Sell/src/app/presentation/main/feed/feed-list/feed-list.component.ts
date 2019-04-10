import { Component, OnInit, Input } from '@angular/core';
import { BaseItemModel } from '../../../shared/models/base-item-model';
import { ProductItem } from '../../../shared/models/product/product-item';
import { ItemContentType } from '../../../shared/commons/enums/item-content-type';

@Component({
  selector: 'app-feed-list',
  templateUrl: './feed-list.component.html'
})
export class FeedListComponent implements OnInit {

  @Input() pageSize: number;

  feeds: BaseItemModel[];

  constructor() { }

  ngOnInit() {
    const feedList: BaseItemModel[] = [];

    const product = new ProductItem({
      thumbnailUrl: 'assets/photos/33.jpg',
      description: 'Ambrosia có nghĩa là “thức ăn của các vị thần” trong thần thoại Hy Lạp cổ đại và được lựa chọn bởi Wilfrid Mennell và vợ, họ phát hiện ra cây táo Ambrosia gốc trong vườn tại',
      name: 'Đào ngâm thuốc sáu tháng không hư',
      id: '2353443435',
      createdDate: '4/12/2018',
      price: 100000,
      contentType: ItemContentType.Product,
      updatedDate: '4/12/2018',
      url: '/product/detail/1'
    });

    feedList.push(product);
    feedList.push(product);

    feedList.push(product);
    feedList.push(product);

    feedList.push(product);

    this.feeds = [...feedList];
  }
}
