import { ModelBase } from '../base.model';

export class SaleDetailReportModel extends ModelBase {
    CreatedDate: string;
    TotalOrder: number;
    TotalSold: number;
    TotalRevenue: number;
    Trend: number; // 0 up, 1 down, 2 same

    constructor () {
      super();
      this.Trend = 2;
    }
}
