import { Component, OnInit, Input } from '@angular/core';
import { ProductItem } from '../../../../shared/models/product/product-item';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent implements OnInit {

  @Input() product: ProductItem;

  constructor() { }

  ngOnInit() {
  }

}
