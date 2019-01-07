import { Injectable } from '@angular/core';
import { WebClientService } from './webclient.service';
import { BehaviorSubject } from 'rxjs';
import { CategoryModel } from '../model/category.model';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { AppSettings } from '../framework/framework.app.setting';
import { ApiResultModel } from '../model/api.result.model';
import { ProductModel } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private getProductListUrl = 'catalog/product-list';
  private getProductListByCateUrl = 'catalog/product-list-by-cate';
  private getProductInfoUrl = 'catalog/product-info';
  private createProductUrl = 'catalog/create-product';
  private removeProductUrl = 'catalog/delete-product';
  private updateProductUrl = 'catalog/update-product';
  private updateImageUrl = 'catalog/change-product-image';
  private imageUrl = 'catalog/product-img?';

  private productListSource = new BehaviorSubject<Array<ProductModel>>(new Array<ProductModel>());
  ProductList = this.productListSource.asObservable();

  constructor(private webClient: WebClientService) {

  }

  // ** get product list of current store */
  fetchProductList(updateUI) {
    const params = new Dictionary<string, any>();
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getProductListUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<ProductModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const productInfo = new ProductModel();
            productInfo.Id = e.productid;
            productInfo.CategoryId = e.categoryid;
            productInfo.CategoryName = e.categoryname;
            productInfo.CreatedDate = e.createddate;
            productInfo.ProductName = e.productname;
            productInfo.Description = e.description;
            productInfo.StoreName = e.storename;
            productInfo.Price = e.price;
            productInfo.InStock = e.instock;
            productInfo.Image = this.getImageUrlById(productInfo.Id);
            resultData.push(productInfo);
           });
           this.productListSource.next(resultData);
           if (updateUI !== null) {
             updateUI();
          }
        }
    });
  }

  // ** get product list of current store by category */
  fetchProductListBycate(cateId, updateUI) {
    const params = new Dictionary<string, any>();
    params.put('CategoryId', cateId);
    this.webClient.doPost(AppSettings.API_ENDPOINT + this.getProductListByCateUrl, params, (data: ApiResultModel) => {
        const resultData = new Array<ProductModel>();
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
          data.Result.forEach(e => {
            const productInfo = new ProductModel();
            productInfo.Id = e.productid;
            productInfo.CategoryId = e.categoryid;
            productInfo.CategoryName = e.categoryname;
            productInfo.CreatedDate = e.createddate;
            productInfo.ProductName = e.productname;
            productInfo.Description = e.description;
            productInfo.StoreName = e.storename;
            productInfo.Price = e.price;
            productInfo.InStock = e.instock;
            productInfo.Image = this.getImageUrlById(productInfo.Id);
            resultData.push(productInfo);
           });
           this.productListSource.next(resultData);
           if (updateUI !== null) {
             updateUI();
          }
        }
    });
  }


   // add new product to store
   async addProduct(product: ProductModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;
    const params = new Dictionary<string, any>();
    params.put('Name', product.ProductName);
    params.put('Description', product.Description);
    params.put('InStock' , product.InStock);
    params.put('CategoryId', product.CategoryId);
    params.put('Price', product.Price);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.createProductUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result = data.Result.productid;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
    });
    return result;
  }

  // edit product from store
  async editProduct(product: ProductModel) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('Id', product.Id);
    params.put('CategoryId', product.CategoryId);
    params.put('Name', product.ProductName);
    params.put('InStock' , product.InStock);
    params.put('Description', product.Description);
    params.put('Price', product.Price);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.updateProductUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result = data.Result.productid;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
    });

    return result;
  }

  // update image
  async updateProductImage(fileData: any, productId: string) {
    let result = AppSettings.RESPONSE_MESSAGE.ERROR;

    const params = new Dictionary<string, any>();
    params.put('Id', productId);
    params.put('ProductImage', fileData);

    await this.webClient.doPostFileDataAsync(AppSettings.API_ENDPOINT + this.updateImageUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      }
    });

    return result;
  }

   // remove product from store
   async removeProduct(productId) {
    let result = AppSettings.RESPONSE_MESSAGE.SUCCESS;

    const params = new Dictionary<string, any>();
    params.put('Id' , productId);
    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.removeProductUrl, params, (data: ApiResultModel) => {
        if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
          result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
        } else if (data.ResponseCode !== AppSettings.RESPONSE_CODE.SUCCESS) {
          result = AppSettings.RESPONSE_MESSAGE.ERROR;
        }
    });

    return result;
  }

  // get product info by id
  async getProductInfoById(id: string) {
    const info = { result: AppSettings.RESPONSE_MESSAGE.ERROR, productInfo: null };
    const params = new Dictionary<string, any>();
    params.put('Id', id);

    await this.webClient.doPostAsync(AppSettings.API_ENDPOINT + this.getProductInfoUrl, params, (data: ApiResultModel) => {
      if (data.ResponseCode === AppSettings.RESPONSE_CODE.SUCCESS) {
        if (data.Result !== null) {
          info.result = AppSettings.RESPONSE_MESSAGE.SUCCESS;
          info.productInfo = new ProductModel();
          info.productInfo.Id = data.Result.productid;
          info.productInfo.CategoryId = data.Result.categoryid;
          info.productInfo.CategoryName = data.Result.categoryname;
          info.productInfo.CreatedDate = data.Result.createddate;
          info.productInfo.ProductName = data.Result.productname;
          info.productInfo.Description = data.Result.description;
          info.productInfo.StoreName = data.Result.storename;
          info.productInfo.InStock = data.Result.instock;
          info.productInfo.Price = data.Result.price;
        }
      } else if (data.ResponseCode === AppSettings.RESPONSE_CODE.UNAUTHORIZED) {
        info.result = AppSettings.RESPONSE_MESSAGE.UNAUTHORIZED;
      } else {
        info.result = AppSettings.RESPONSE_MESSAGE.ERROR;
      }
    });

    return info;
  }


  getImageUrlById(productId: string) {
    return AppSettings.API_ENDPOINT + this.imageUrl + 'pid=' + productId + '&random=' + Math.random();
  }
}
