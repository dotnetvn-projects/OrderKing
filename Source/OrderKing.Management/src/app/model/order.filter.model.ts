export class OrderFilterModel {
  OrderCode: string;
  FromDate: string;
  ToDate: string;
  OrderStatus: string;

  constructor() {
    this.OrderCode = '';
    this.OrderStatus = '0';
    this.defaultSearchDate();
  }

  emptyField() {
    this.OrderStatus = '0';
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
