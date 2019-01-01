import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { CategoryModel } from '../model/category.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private getCategoryListUrl = 'catalog/category-list';
  private getCategoryImageUrl = 'catalog/cate-img?';

  private categoryListSource = new BehaviorSubject<Array<CategoryModel>>(new Array<CategoryModel>());
  CategoryList = this.categoryListSource.asObservable();

  constructor(private webClient: WebClientService) {

  }

  // ** get category list of current store */
  fetchCategoryList(updateUI) {
    const params = new Dictionary<string, any>();
    params.put('AccessToken' , sessionStorage.getItem(AppSettings.TOKEN_KEY));

    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getCategoryListUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<CategoryModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const categoryInfo = new CategoryModel();
            categoryInfo.Id = e.categoryid;
            categoryInfo.CategoryName = e.categoryname;
            categoryInfo.CreatedDate = e.createddate;
            categoryInfo.Image = this.getImageUrlByCateId(categoryInfo.Id);
            resultData.push(categoryInfo);
           });
           this.categoryListSource.next(resultData);
           if (updateUI !== null) {
             updateUI();
          }
        }
    });
  }

  getImageUrlByCateId(cateId: string) {
    return AppSettings.API_ENDPOINT + this.getCategoryImageUrl + 'cid=' + cateId + '&random=' + Math.random();
  }
}
