import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Dictionary } from '../framework/objectextension/dictionary';
import { ApiResultModel } from '../model/api.result.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebClientService {

  constructor(private http: HttpClient) {}

  /**Result data which returned from calling http action */
  public Result: ApiResultModel;

  // build http parameters for call normal api
  private buildHttpParams(params: Dictionary<string, any>) {
    let body = new HttpParams();
    params.getKeys().forEach((key: any) => {
      body = body.set(key, params.get(key));
    });

    return body;
  }

  // create call http post promise
  private createPostPromise(url: string, formdata: object, contenttype: string): Promise<Observable<Response>> {
    return new Promise(resolve => {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  contenttype
        })};

        let res: any;
        this.http.post(url, formdata, httpOptions).subscribe(
            (response: any) => {
              res = response;
            },
            exception => {
              res = exception.error;
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
        let res: any;
        this.http.get(url).subscribe(
            (response: any) => {
              res = response;
            },
            exception => {
                throw exception;
            },
            () => {
                resolve(res);
            }
        );
    });
  }

  /**call http post api without waiting */
  doPost(url: string, body: Dictionary<string, any>, callback: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded'
      })};

    const data = this.buildHttpParams(body);
    this.http.post(url, data, httpOptions).subscribe(
      (res: any) => {
        this.Result = new ApiResultModel();
        this.Result.ResponseCode = res.responsecode;
        this.Result.ResponseCode = res.statusmessage;
        this.Result.ResponseDate = res.responsedate;
        this.Result.Result = res.result;
        if (callback != null) {
          callback(this.Result);
        }
      },
      exception => {
          throw exception;
      });
  }

  /**call http post and wait it finishes*/
  async doPostAsync(url: string, body: Dictionary<string, any>, callback: any) {
    const data = this.buildHttpParams(body);
    await this.createPostPromise(url, data, 'application/x-www-form-urlencoded').then(
      (res: any) => {
        this.Result = new ApiResultModel();
        this.Result.ResponseCode = res.responsecode;
        this.Result.Status = res.statusmessage;
        this.Result.ResponseDate = res.responsedate;
        this.Result.Result = res.result;
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
      this.Result = new ApiResultModel();
      this.Result.ResponseCode = res.responsecode;
      this.Result.Status = res.statusmessage;
      this.Result.ResponseDate = res.responsedate;
      this.Result.Result = res.result;
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
    this.http.get(url).subscribe(
      (res: any) => {
        this.Result = new ApiResultModel();
        this.Result.ResponseCode = res.responsecode;
        this.Result.Status = res.statusmessage;
        this.Result.ResponseDate = res.responsedate;
        this.Result.Result = res.result;
        if (callback != null) {
          callback(this.Result);
        }
      },
      exception => {
          throw exception;
      });
  }
}
