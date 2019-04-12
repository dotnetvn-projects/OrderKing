export class ReportFilterModel {
  FromDate: string;
  ToDate: string;
  PageSize: number;
  PageNumber: number;

  constructor () {
    this.defaultSearchDate();
  }

  defaultSearchDate() {
    let date = new Date();
    date.setMonth(date.getMonth() - 1);
    this.FromDate = date.getDate() + '/' +  (date.getMonth() + 1) + '/' + date.getFullYear();
    date = new Date();
    this.ToDate = date.getDate() + '/' +  (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
