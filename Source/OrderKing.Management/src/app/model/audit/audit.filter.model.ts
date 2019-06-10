export class AuditFilterModel {
  PageSize: number;
  PageNumber: number;
  FromDate: string;
  ToDate: string;


  constructor() {
    this.defaultSearchDate();
    this.PageSize = 20;
    this.PageNumber = 1;
  }

  emptyField() {
    this.FromDate = '';
    this.ToDate = '';
  }

  defaultSearchDate() {
    let date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    this.FromDate = date.getDate() + '/' +  (date.getMonth() + 1) + '/' + date.getFullYear();
    date = new Date();
    this.ToDate = date.getDate() + '/' +  (date.getMonth() + 1) + '/' + date.getFullYear();
  }
}
