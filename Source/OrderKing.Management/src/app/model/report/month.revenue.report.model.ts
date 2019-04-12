import { ModelBase } from '../base.model';

export class MonthRevenueReportModel extends ModelBase {
    Year: number;
    Revenue: number;
    January: number;
    February: number;
    March: number;
    April: number;
    May: number;
    June: number;
    July: number;
    August: number;
    September: number;
    October: number;
    November: number;
    December: number;

    constructor () {
      super();
    }
}
