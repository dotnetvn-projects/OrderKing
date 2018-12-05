import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-category',
  templateUrl: './category.create.view.html',
  styleUrls: ['./category.create.style.scss']
})
export class CreateCategoryComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Order King - tạo mới danh mục');
  }
}

