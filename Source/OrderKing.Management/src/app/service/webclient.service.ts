import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Dictionary } from '../framework/objectextension/dictionary';
import { ApiResult } from '../model/api.result.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebClientService {

  constructor(private http: HttpClient) {}

  /**Result data which returned from calling http action */
  public Result: ApiResult;

  // build http parameters for call normal api
  private buildHttpParams(params: Dictionary<string, any>) {
    const body = new HttpParams();
    params.getKeys().forEach((key: any) => {
      body.set(key, params.get(key));
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
            error => {
                throw error;
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
            error => {
                throw error;
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
        this.Result = new ApiResult();
        this.Result.ResponseCode = res.responsecode;
        this.Result.ResponseCode = res.statusmessage;
        this.Result.ResponseDate = res.responsedate;
        this.Result.Result = res.result;
        if (callback != null) {
          callback(this.Result);
        }
      },
      error => {
          throw error;
      });
  }

  /**call http post and wait it finishes*/
  async doPostAsync(url: string, body: Dictionary<string, any>, callback: any) {
    const data = this.buildHttpParams(body);
    await this.createPostPromise(url, data, 'application/x-www-form-urlencoded').then(
      (res: any) => {
        this.Result = new ApiResult();
        this.Result.ResponseCode = res.responsecode;
        this.Result.ResponseCode = res.statusmessage;
        this.Result.ResponseDate = res.responsedate;
        this.Result.Result = res.result;
        if (callback != null) {
          callback(this.Result);
        }
      },
        err => {
            throw err;
        }
    );
  }

 /**call http get and wait it finishes*/
 async doGetAsync(url: string,  callback: any) {
  await this.createGetPromise(url).then(
    (res: any) => {
      this.Result = new ApiResult();
      this.Result.ResponseCode = res.responsecode;
      this.Result.ResponseCode = res.statusmessage;
      this.Result.ResponseDate = res.responsedate;
      this.Result.Result = res.result;
      if (callback != null) {
        callback(this.Result);
      }
    },
      err => {
          throw err;
      }
    );
  }

  /**call http get api without waiting */
  doGet(url: string, callback: any) {
    this.http.get(url).subscribe(
      (res: any) => {
        this.Result = new ApiResult();
        this.Result.ResponseCode = res.responsecode;
        this.Result.ResponseCode = res.statusmessage;
        this.Result.ResponseDate = res.responsedate;
        this.Result.Result = res.result;
        if (callback != null) {
          callback(this.Result);
        }
      },
      error => {
          throw error;
      });
  }
}
