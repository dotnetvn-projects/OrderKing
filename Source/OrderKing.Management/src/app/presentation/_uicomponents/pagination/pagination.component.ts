import { OnInit, Input, Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { PagerModel } from '../../../model/pager.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.view.html',
  styleUrls: ['./pagination.style.scss']
})

// https://embed.plnkr.co/plunk/oyFWJe

export class PaginationComponent implements OnInit {

  @Input() Css: string;
  @Input() PageSize: number;
  @Input() PageNumber: number;
  @Input() TotalPage: number;
  Pager: PagerModel = new PagerModel();
  @Output() PageChange: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.Css = '';
    this.PageSize = 5;
    this.PageNumber = 1;
    this.TotalPage = 0;
  }

  ngOnInit() {
     this.Pager = this.getPager(this.TotalPage, this.PageNumber, this.PageSize);
  }


  setPage(page: number, fireEvent: boolean = false) {
      if (page < 1 || page > this.Pager.TotalPages) {
          return;
      }

      // get pager object from service
      this.Pager = this.getPager(this.TotalPage, page, this.PageSize);

     // if (fireEvent === true) {
        this.PageChange.emit(page);
    //  }
  }

  private getPager(totalItems: number, currentPage: number = 1, pageSize: number = 5): PagerModel {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;

    if (totalPages <= 5) {
        startPage = 1;
        endPage = totalPages;
    } else {
        if (currentPage <= 3) {
            startPage = 1;
            endPage = 5;
        } else if (currentPage + 1 >= totalPages) {
            startPage = totalPages - 4;
            endPage = totalPages;
        } else {
            startPage = currentPage - 2;
            endPage = currentPage + 2;
        }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    // const pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    const pagerModel = new PagerModel();
    pagerModel.TotalItems = totalItems;
    pagerModel.CurrentPage = currentPage;
    pagerModel.PageSize = pageSize;
    pagerModel.TotalPages = totalPages;
    pagerModel.StartPage = startPage;
    pagerModel.EndPage = endPage;
    pagerModel.StartIndex = startIndex;
    pagerModel.EndIndex = endIndex;
    pagerModel.Pages = pages;

    return pagerModel;

}
}
