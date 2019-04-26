import { ModelBase } from '../base.model';
import { ProductReportModel } from './product.report.model';

export class ProductSoldReportModel extends ModelBase {
    ProductList: ProductReportModel[];
    TotalRecord: number;

    constructor () {
      super();
      this.TotalRecord = 0;
    }
}
