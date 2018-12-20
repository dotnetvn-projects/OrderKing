import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AppSettings } from './framework.app.setting';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const token = sessionStorage.getItem(AppSettings.TOKEN_KEY);
    if (token === undefined || token === null) {
     this.router.navigate(['dang-nhap']);
     return false;
    } else {
      const result = await this.auth.isTokenExpired();
      if (result === true) {
        this.router.navigate(['dang-nhap']);
        return false;
      }
    }
    return true;
  }
}
