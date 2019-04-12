import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './presentation/main/auth/auth.module#AuthModule',
  },
  {
    path: 'products',
    loadChildren: './presentation/main/product/product-list/product-list.module#ProductListModule'
  },
  {
    path: '',
    loadChildren: './presentation/main/feed/feed-list/feed-list.module#FeedListModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
