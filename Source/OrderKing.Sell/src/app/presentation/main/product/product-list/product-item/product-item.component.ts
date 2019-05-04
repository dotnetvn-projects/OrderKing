import { Component, Input } from '@angular/core';
import { ProductItem } from '../../../../shared/models/product/product-item';
import { OrderDetailService } from '../../../../../service/order-detail.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {

  @Input() product: ProductItem;

  constructor(private orderDetailService:OrderDetailService) {}

  addOrder() {
    this.orderDetailService.addOrder(this.product);
  }
}
