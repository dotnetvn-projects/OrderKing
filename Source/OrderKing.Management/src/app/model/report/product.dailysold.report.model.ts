import { ModelBase } from '../base.model';
import { ProductReportModel } from './product.report.model';

export class ProductDailySoldReportModel extends ModelBase {
    ProductList: ProductReportModel[];
    TotalRecord: number;

    constructor () {
      super();
      this.TotalRecord = 0;
    }
}
