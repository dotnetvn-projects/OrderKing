import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: string[] = [];

  constructor(private http: Http) {}

  // get category list
  getCategoryList() {
    let apiData = this.http
      .get('http://localhost:1337/api/public/')
      .pipe(map((response: any) => response.json()));


  }
}
