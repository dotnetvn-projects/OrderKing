import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './presentation/_layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './presentation/_layout/main-layout/main-layout.component';
import { LoginModule } from './presentation/login/login.module';
import { MainRoutes } from './routing/main.routing';

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    MainLayoutComponent
  ],
  imports: [
    RouterModule.forRoot(MainRoutes),
    LoginModule,
    BrowserModule, FormsModule, HttpClientModule
  ],
  providers: [
    Title
  ],
  bootstrap: [AppComponent]
})
export class MainModule { }
