import { OnInit, Input, Component } from '@angular/core';
import { Breadcrumb } from 'src/app/model/breadcrumb.model';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './breadcrumb.view.html',
  styleUrls: ['./breadcrumb.style.scss']
})

export class BreadcrumbComponent implements OnInit {
  @Input() Root: Array<string>;
  @Input() Active: string;
  RootPath: Array<Breadcrumb>;
  ActivePath: string;
  @Input() Title: string;
  TitleString: string;

  constructor() {
    this.RootPath = new Array<Breadcrumb>();
    this.Root = new Array<string>();
    this.ActivePath = '';
  }

  ngOnInit() {
    // "['name@(url),name2@(url2)']"
    this.ActivePath = this.Active;
    this.TitleString = this.Title;
    this.Root.forEach(e => {
      const breadcrumb = new Breadcrumb();
      const item = e.split('@');
      breadcrumb.Name = item[0];
      breadcrumb.Url = item[1].replace('(', '').replace(')', '');
      this.RootPath.push(breadcrumb);
    });
  }
}
