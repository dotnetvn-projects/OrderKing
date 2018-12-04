import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { MasterPageComponent } from './masterpage/masterpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainRoutes } from '../../routing/main.routing';
@NgModule({
  declarations: [
      MasterPageComponent,
      DashboardComponent
  ],
  imports: [
    RouterModule.forRoot(MainRoutes),
    BrowserModule, FormsModule
  ],
  providers: [
    Title
  ],
  bootstrap: [MasterPageComponent]
})
export class MainModule { }
