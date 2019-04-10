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
    loadChildren: './presentation/main/product/product-page/product-page.module#ProductPageModule'
  },
  {
    path: '',
    loadChildren: './presentation/main/feed/feed-page/feed-page.module#FeedPageModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
