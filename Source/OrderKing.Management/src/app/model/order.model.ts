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
}
