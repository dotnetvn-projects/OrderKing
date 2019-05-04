import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject }    from 'rxjs';
import { ProductItem } from '../presentation/shared/models/product/product-item';

@Injectable()
export class OrderDetailService {

  // Observable product sources
  public orderAddSource = new Subject<ProductItem>();

  // Observable product streams
  orderAddAnnounced$ = this.orderAddSource.asObservable();

  // Service message commands
  addOrder(product: ProductItem) {
    this.orderAddSource.next(product);
  }
}