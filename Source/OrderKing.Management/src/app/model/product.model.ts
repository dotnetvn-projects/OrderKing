import { ModelBase } from './base.model';

export class ProductModel extends ModelBase {
    ProductName: string;
    CategoryName: string;
    CategoryId: string;
    Description: string;
    StoreName: string;
    CreatedDate: string;
    InStock: number;
    Price: number;

    constructor () {
      super();
          this.Price = 0;
          this.InStock = 0;
    }
}
