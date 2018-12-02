import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { MasterPageComponent } from './MasterPage/MasterPage.Component';
import { DashboardComponent } from './Dashboard/Dashboard.Component';
import { MainRoutes } from './Routing/App.MainRouting';
@NgModule({
  declarations: [
      MasterPageComponent,
      DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(MainRoutes),
    BrowserModule, FormsModule
  ],
  providers: [],
  bootstrap: [MasterPageComponent]
})
export class MainModule { }
