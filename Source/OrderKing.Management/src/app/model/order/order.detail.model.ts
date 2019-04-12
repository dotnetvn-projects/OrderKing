import { ModelBase } from '../base.model';

export class OrderDetailModel extends ModelBase {
   OrderId: string;
   ProductName: string;
   ProductCode: string;
   Amount: number;
   Price: number;
   Total: number;
}
