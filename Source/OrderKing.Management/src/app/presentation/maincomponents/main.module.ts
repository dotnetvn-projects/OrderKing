import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MasterPageComponent } from './masterpage/masterpage.component';
import { LoginModule } from './login/login.module';
import { LoginLayoutComponent } from '../_layout/login-layout/login-layout.component';
import { MainRoutes } from '../../routing/main.routing';

@NgModule({
  declarations: [
    MasterPageComponent,
    DashboardComponent,
    LoginLayoutComponent
  ],
  imports: [
    RouterModule.forRoot(MainRoutes),
    LoginModule, BrowserModule, FormsModule, HttpClientModule
  ],
  providers: [
    Title
  ],
  bootstrap: [MasterPageComponent]
})
export class MainModule { }
