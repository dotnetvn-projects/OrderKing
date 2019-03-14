import { ModelBase } from './base.model';

export class SummaryReportModel extends ModelBase {
    TotalOrder: string;
    TotalNewOrder: number;
    TotalProduct: number;
    TotalRevenue: number;

    constructor () {
      super();
    }
}
