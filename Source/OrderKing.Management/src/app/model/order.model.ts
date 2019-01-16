import { ModelBase } from './base.model';

export class OrderModel extends ModelBase {
  StoreName: string;
  OrderCode: string;
  SeqNum: number;
  TotalPrice: number;
  Amount: number;
  CreatedDate: string;
  UpdatedDate: string;
  OrderStatus: number;
  SellerAccount: string;
  Seller: string;
  Comment: string;

  getOrderStatusString() {
    switch (this.OrderStatus) {
      case 1:
         return 'Hoàn thành';
      case 2:
         return 'Hủy';
      case 3:
         return 'Chửa xử lý';
      default:
        return '';
    }
  }
}
