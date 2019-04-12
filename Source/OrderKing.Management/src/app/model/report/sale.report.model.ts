import { ModelBase } from '../base.model';

export class SaleReportModel extends ModelBase {
    CreateDate: string;
    TotalOrder: number;
    TotalSold: number;
    TotalRevenue: number;
    Trend: number; // 0 up, 1 down, 2 same

    constructor () {
      super();
      this.Trend = 2;
    }
}
