import { Component, OnInit, Input } from '@angular/core';
import { ProductItem } from '../../../shared/models/product/product-item';
import { BaseItemModel } from '../../../shared/models/base-item-model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input() pageSize: number;
  products: BaseItemModel[];

  constructor() { }

  ngOnInit() {
    const listProduct: BaseItemModel[] = [];
    this.pageSize = this.pageSize === null || this.pageSize === undefined ? 20 : this.pageSize;
    for (let i = 0; i < this.pageSize; i++) {
      const product = new ProductItem({
        thumbnailUrl: 'assets/photos/peach.png',
        description: '',
        name: 'Đào ngâm thuốc sáu tháng không hư',
        id: '2353443435',
        createdDate: '4/12/2018',
        price: 100000,
        url: '/product/detail/1',
        updatedDate: '4/12/2018',
      });

      listProduct.push(product);
    }

    this.products = [...listProduct];
  }

}
