import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Dictionary } from '../framework/objectextension/framework.dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { Observable } from 'rxjs';
import { AppSettings } from '../framework/framework.app.setting';

@Injectable({
  providedIn: 'root'
})
export class WebClientService {

  constructor(private http: HttpClient) {}

  /**Result data which returned from calling http action */
  public Result: ApiResultModel;

  // build http parameters for call normal api
  private buildHttpParams(params: Dictionary<string, any>) {
    let body = AppSettings.createDefaultHttpParams();
    params.getKeys().forEach((key: any) => {
      body = body.set(key, params.get(key));
    });

    return body;
  }

  // handle exception
  private handleException (exception: any) {
    let res = exception.error;
    if (exception.status === 404) {
      res = { responsecode: 404, statusmessage: 'Page Not Found', responsedate: null, result: null };
    }
    if (exception.status === 503) {
      res = { responsecode: 503, statusmessage: 'Service Unavailable', responsedate: null, result: null };
    }
    if (exception.status === 401) {
      res = { responsecode: 401, statusmessage: 'UnAuthorized', responsedate: null, result: null };
    }
    if (exception.status === 400) {
      res = { responsecode: 400, statusmessage: 'Bad Request', responsedate: null, result: null };
    }
    if (exception.status === 410) {
      res = { responsecode: 410, statusmessage: 'Token Expired', responsedate: null, result: null };
    }
    if (exception.status === 422) {
      res = { responsecode: 422, statusmessage: 'Invalid request', responsedate: null, result: null };
    }
    return res;
  }

  // create api result
  private createApiResult(res: any) {
    this.Result = new ApiResultModel();
    this.Result.ResponseCode = res.responsecode;
    this.Result.ResponseCode = res.statusmessage;
    this.Result.ResponseDate = res.responsedate;
    this.Result.Result = res.result;
  }

  //  headers = headers.set('referer', 'http://manage.orderking.com');
   // headers = headers.set('apikey', '0daeb74c82c8f2287038959ce8697896');
  // create call http post promise
  private createPostPromise(url: string, formdata: object, contenttype: string): Promise<Observable<Response>> {
    return new Promise(resolve => {
      let httpHeaders  = new HttpHeaders();
      httpHeaders  = AppSettings.createDefaultHeaders().set('Content-Type', contenttype);
      const httpOptions = {headers: httpHeaders };

      let res: any;
      this.http.post(url, formdata, httpOptions).subscribe(
        (response: any) => {
          res = response;
        },
        exception => {
          res = this.handleException(exception);
          resolve(res);
        },
        () => {
            resolve(res);
        }
      );
    });
  }

  // create call http get promise
  private createGetPromise(url: string): Promise<Observable<Response>> {
    return new Promise(resolve => {
      const httpOptions = {headers: AppSettings.createDefaultHeaders()};
      let res: any;
      this.http.get(url, httpOptions).subscribe(
          (response: any) => {
            res = response;
          },
          exception => {
            res = this.handleException(exception);
            resolve(res);
          },
          () => {
              resolve(res);
          }
      );
    });
  }

  /**call http post api without waiting */
  doPost(url: string, body: Dictionary<string, any>, callback: any) {
    const httpOptions = {headers: AppSettings.createDefaultHeaders().append('Content-Type', 'application/x-www-form-urlencoded')};
    const data = this.buildHttpParams(body);
    this.http.post(url, data, httpOptions).subscribe(
      (res: any) => {
        this.createApiResult(res);
        if (callback != null) {
          callback(this.Result);
        }
      },
      exception => {
        const res = this.handleException(exception);
        this.createApiResult(res);
        if (callback != null) {
          callback(this.Result);
        }
      });
  }

  /**call http post and wait it finishes*/
  async doPostAsync(url: string, body: Dictionary<string, any>, callback: any) {
    const data = this.buildHttpParams(body);
    await this.createPostPromise(url, data, 'application/x-www-form-urlencoded').then(
      (res: any) => {
        this.createApiResult(res);
        if (callback != null) {
          callback(this.Result);
        }
      },
      exception => {
            throw exception;
        }
    );
  }

 /**call http get and wait it finishes*/
 async doGetAsync(url: string,  callback: any) {
  await this.createGetPromise(url).then(
    (res: any) => {
      this.createApiResult(res);
      if (callback != null) {
        callback(this.Result);
      }
    },
    exception => {
          throw exception;
      }
    );
  }

  /**call http get api without waiting */
  doGet(url: string, callback: any) {
    const httpOptions = {headers: AppSettings.createDefaultHeaders()};
    this.http.get(url, httpOptions).subscribe(
      (res: any) => {
        this.createApiResult(res);
        if (callback != null) {
          callback(this.Result);
        }
      },
      exception => {
        const res = this.handleException(exception);
        this.createApiResult(res);
        if (callback != null) {
          callback(this.Result);
        }
      });
  }
}
