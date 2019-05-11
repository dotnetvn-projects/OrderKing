import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OrderItem } from '../../../shared/models/order/order-item';

@Component({
  selector: 'app-order-item',
  styleUrls: ["./order-item.component.css"],
  templateUrl: './order-item.component.html'
})
export class OrderItemComponent implements OnInit {
  @Input() order: OrderItem;
  
  constructor() {

  }

  ngOnInit() {
    
  }
}
