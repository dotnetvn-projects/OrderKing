import { ModelBase } from '../base.model';
import { SaleDetailReportModel } from './sale.detail.report.model';

export class SaleReportModel extends ModelBase {
    SaleReportList: SaleDetailReportModel[];
    TotalRecord: number;

    constructor () {
      super();
      this.TotalRecord = 0;
    }
}
