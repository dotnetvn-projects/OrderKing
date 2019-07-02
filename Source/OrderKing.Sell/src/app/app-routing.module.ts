import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './framework/framework.auth.guard';


const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './presentation/main/auth/auth.module#AuthModule',
  },
  {
    path: 'products',
    loadChildren: './presentation/main/product/product-list/product-list.module#ProductListModule',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: './presentation/main/feed/feed-list/feed-list.module#FeedListModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
