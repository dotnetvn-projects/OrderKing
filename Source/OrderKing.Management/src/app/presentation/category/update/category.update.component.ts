import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-update-category',
  templateUrl: './category.update.view.html',
  styleUrls: ['./category.update.style.scss']
})
export class UpdateCategoryComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Order King - chỉnh sửa danh mục');
  }
}

