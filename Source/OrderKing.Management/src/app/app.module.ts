import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './framework/framework.auth.guard';
import { AppComponent } from './app.component';
import { LoginLayoutComponent } from './presentation/_layout/login-layout/login-layout.component';
import { MainLayoutComponent } from './presentation/_layout/main-layout/main-layout.component';
import { PrintLayoutComponent } from './presentation/_layout/print-layout/print-layout.component';
import { LoginModule } from './presentation/main/login/login.module';
import { MainRoutes } from './routing/main.routing';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginLayoutComponent,
    MainLayoutComponent,
    PrintLayoutComponent
  ],
  imports: [
    RouterModule.forRoot(MainRoutes),
    LoginModule, LoadingBarRouterModule,
    BrowserModule, FormsModule, HttpClientModule,
    NgxSpinnerModule
  ],
  providers: [
    Title, AuthGuard, DatePipe
  ],
  bootstrap: [AppComponent]
})
export class MainModule { }
