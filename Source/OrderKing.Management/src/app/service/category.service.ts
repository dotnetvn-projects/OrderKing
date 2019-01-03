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
  private createCateUrl = 'catalog/create-category';
  private updateCateUrl = 'catalog/update-category';
  private categoryInfoUrl = 'catalog/category-info';
  private updateImageUrl = 'catalog/change-category-image';
  private categoryImageUrl = 'catalog/cate-img?';
  private removeCategoryUrl = 'catalog/delete-category';

  private categoryListSource = new BehaviorSubject<Array<CategoryModel>>(
    new Array<CategoryModel>()
  );
  CategoryList = this.categoryListSource.asObservable();

  constructor(private webClient: WebClientService) {}

  // ** get category list of current store */
  fetchCategoryList(updateUI) {
    const params = new Dictionary<string, any>();
    this.webClient.doPost(
      AppSettings.API_ENDPOINT + this.getCategoryListUrl,
      params,
      (data: ApiResultModel) => {
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
      }
    );
  }

  // get simple list
  async getSimpleList() {
    const params = new Dictionary<string, any>();
    const resultData = new Array<CategoryModel>();
    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.getCategoryListUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const categoryInfo = new CategoryModel();
            categoryInfo.Id = e.categoryid;
            categoryInfo.CategoryName = e.categoryname;
            resultData.push(categoryInfo);
          });
        }
      }
    );
    return resultData;
  }

  // add new category to store
  async addCategory(category: CategoryModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;
    const params = new Dictionary<string, any>();
    params.put('Name', category.CategoryName);

    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.createCateUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = data.Result.categoryid;
        } else if (
          data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED
        ) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
      }
    );
    return result;
  }

  // edit category from store
  async editCategory(category: CategoryModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('Id', category.Id);
    params.put('Name', category.CategoryName);

    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.updateCateUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = data.Result.categoryid;
        } else if (
          data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED
        ) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
      }
    );

    return result;
  }

  // update image
  async updateCategoryImage(fileData: any, cateId: string) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('Id', cateId);
    params.put('CateImage', fileData);

    await this.webClient.doPostFileDataAsync(
      AppSettings.API_ENDPOINT + this.updateImageUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
        } else if (
          data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED
        ) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        }
      }
    );

    return result;
  }

  // remove category from store
  async removeCategory(cateId) {
    let result = AppSettings.RESPONSE_MESSAGE.SUCCESS;

    const params = new Dictionary<string, any>();
    params.put('Id', cateId);
    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.removeCategoryUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else if (data.ResponseCode !== AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
      }
    );

    return result;
  }

  // get category info by id
  async getCategoryInfoById(id: string) {
    const info = { result: AppSettings.RESPONSE_MESSAGE.ERROR, cateInfo: null };
    const params = new Dictionary<string, any>();
    params.put('Id', id);

    await this.webClient.doPostAsync(
      AppSettings.API_ENDPOINT + this.categoryInfoUrl,
      params,
      (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          if (data.Result !== null) {
            info.result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
            info.cateInfo = new CategoryModel();
            info.cateInfo.Id = data.Result.categoryid;
            info.cateInfo.CategoryName = data.Result.categoryname;
            info.cateInfo.CreatedDate = data.Result.createddate;
          }
        } else if (
          data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED
        ) {
          info.result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else {
          info.result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
      }
    );

    return info;
  }

  getImageUrlByCateId(cateId: string) {
    return (
      AppSettings.API_ENDPOINT + this.categoryImageUrl + 'cid=' + cateId + '&random=' + Math.random()
    );
  }
}
