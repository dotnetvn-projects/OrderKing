import { ModelBase } from './base.model';

export class OrderDetailModel extends ModelBase {
   OrderId: string;
   ProductName: string;
   Amount: number;
   Price: number;
   Total: number;
}
