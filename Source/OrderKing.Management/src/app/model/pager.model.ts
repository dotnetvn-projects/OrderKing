import { ModelBase } from './base.model';

export class PagerModel extends ModelBase {
  TotalItems: number;
  CurrentPage: number;
  PageSize: number;
  TotalPages: number;
  StartPage: number;
  EndPage: number;
  StartIndex: number;
  EndIndex: number;
  Pages: any[];
    constructor () {
      super();
    }
}
