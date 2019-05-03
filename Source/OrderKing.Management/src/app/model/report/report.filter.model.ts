export class ReportFilterModel {
  FromDate: string;
  ToDate: string;
  Type: string;
  Top: number;
  PageSize: number;
  PageNumber: number;
  TopList: Array<number>;

  constructor () {
    this.defaultSearchDate();
    this.PageNumber = 1;
    this.PageSize = 10;
    this.Top = 20;
    this.TopList = [5, 10, 20, 30, 40, 50];
    this.Type = '';
  }

  defaultSearchDate() {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.FromDate = date.getDate() + '/' +  (date.getMonth() + 1) + '/' + date.getFullYear();
    date = new Date();
    this.ToDate = date.getDate() + '/' +  (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
