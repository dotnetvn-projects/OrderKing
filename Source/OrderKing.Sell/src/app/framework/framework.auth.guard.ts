import { Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

   async canActivate(): Promise<boolean> {
     const isLogined = await this.auth.isLogined();
    if (!isLogined) {
     this.router.navigate(['auth/login']);
     return false;
    } else {
       const result = await this.auth.isTokenExpired();
        if (result === true) {
          this.router.navigate(['auth/login']);
         return false;
        } else {
          return true;
        }
    }
  }
}
