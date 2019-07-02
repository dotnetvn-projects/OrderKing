import { Component, Input } from '@angular/core';
import { ProductItem } from '../../../../shared/models/product/product-item';
import { OrderDetailService } from '../../../../../service/order-detail.service';
import { faHandPointer } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css']
})
export class ProductItemComponent {
  faHandPointer = faHandPointer;
  @Input() product: ProductItem;

  constructor(private orderDetailService: OrderDetailService) {}

  addOrder() {
    this.orderDetailService.addOrder(this.product);
  }
}
