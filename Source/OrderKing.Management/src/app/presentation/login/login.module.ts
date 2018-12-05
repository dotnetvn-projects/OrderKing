import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {  LoginComponent } from './login.component';
import { LoginRoutes } from '../../routing/login.routing';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(LoginRoutes),
    CommonModule, FormsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [LoginComponent]
})
export class LoginModule { }
