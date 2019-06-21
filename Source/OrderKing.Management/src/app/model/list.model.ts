export class ListModel<T> {
 Items: Array<T>;
 TotalRecord: number;

 constructor() {
   this.Items = new Array<T>();
 }

}
