import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreModule } from '../../../core/core.module';
import { FeedListModule } from '../feed-list/feed-list.module';
import { FeedPageComponent } from './feed-page.component';

const feedRoutes: Routes = [
  {
    path: '',
    component: FeedPageComponent
  }
];

@NgModule({
  declarations: [
    FeedPageComponent
  ],
  imports: [
    RouterModule.forChild(feedRoutes),
    CoreModule,
    FeedListModule
  ],
  exports: [
    FeedPageComponent
  ]
})
export class FeedPageModule { }
