import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { OrderDetailService } from '../../../service/order-detail.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-detail',
  styleUrls: ["./order-detail.component.css"],
  templateUrl: './order-detail.component.html'
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  
  constructor(private orderDetailService: OrderDetailService) {
    
  }

  ngOnInit() {
    this.subscription = this.orderDetailService.orderAddAnnounced$.subscribe(
      product => {
        console.log(product)
      });
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
