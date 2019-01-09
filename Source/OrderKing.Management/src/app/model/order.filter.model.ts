export class OrderFilterModel {
  OrderCode: string;
  FromDate: string;
  ToDate: string;
  OrderStatus: number;

  constructor() {
    const date = new Date();
    this.FromDate = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    date.setDate(date.getDate() + 7);
    this.ToDate = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }
}
