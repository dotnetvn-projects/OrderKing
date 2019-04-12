import { ModelBase } from '../base.model';

export class RevenueReportModel extends ModelBase {
    DailyRevenue: number;
    WeeklyRevenue: number;
    MonthlyRevenue: number;
    YearlyRevenue: number;

    constructor () {
      super();
    }
}
