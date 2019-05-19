import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OrderItem } from '../../../shared/models/order/order-item';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-item',
  styleUrls: ["./order-item.component.css"],
  templateUrl: './order-item.component.html'
})
export class OrderItemComponent implements OnInit {
  @Input() order: OrderItem;
  faTimes = faTimes;
  faArrowAltCircleDown = faArrowAltCircleDown;
  @Output() onRemoved: EventEmitter<any> = new EventEmitter<any>();
  @Output() onQuantityDecreased: EventEmitter<any> = new EventEmitter<any>();
  
  constructor() {

  }

  remove(){
    this.onRemoved.emit(this.order);
  }

  decreaseQuantity(){
    if(this.order.quantity > 1){
      this.order.quantity -= 1;
      this.order.totalPrice -= this.order.price;
      this.onQuantityDecreased.emit(this.order);
    }
    else {
      this.remove();
    }
  }

  ngOnInit() {
    
  }
}
