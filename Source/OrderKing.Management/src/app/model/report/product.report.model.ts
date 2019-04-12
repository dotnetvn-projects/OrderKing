import { ModelBase } from '../base.model';

export class ProductReportModel extends ModelBase {
    ProductName: string;
    ProductCode: string;
    TotalSold: number;
    Revenue: number;

    constructor () {
      super();
    }
}
