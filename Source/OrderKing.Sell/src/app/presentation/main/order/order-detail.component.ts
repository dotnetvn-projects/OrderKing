import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OrderDetailService } from '../../../service/order-detail.service';
import { Subscription } from 'rxjs';
import { OrderItem } from '../../shared/models/order/order-item';

@Component({
  selector: 'app-order-detail',
  styleUrls: ["./order-detail.component.css"],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  
  orders: OrderItem[];
  totalProduct: number;
  totalPrice: number;
  
  constructor(private orderDetailService: OrderDetailService) {
    this.totalProduct = 0;
    this.totalPrice = 0;
    this.orders = [];
  }

  ngOnInit() {
    this.subscription = this.orderDetailService.orderAddAnnounced$.subscribe(
      product => {
        let productOrders: OrderItem[] = [];

        productOrders = [...this.orders];
        if(productOrders && productOrders.some(order => order.productId === product.id)){
          productOrders.forEach(item => {

            if(item.productId === product.id){
              item.quantity += 1;
              item.totalPrice += product.price;
            }
            return item;
          })
        }
        else {
          let orderItem = new OrderItem({
            price: product.price,
            productId: product.id,
            productName: product.name,
            quantity: 0,
            totalPrice: 0,
            productImageUrl: product.thumbnailUrl
          });
  
          orderItem.totalPrice += product.price;
          orderItem.quantity = 1;
          productOrders.push(orderItem);
        }
        
        this.orders = [...productOrders];
        this.totalProduct += 1;
        this.totalPrice += product.price;
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
