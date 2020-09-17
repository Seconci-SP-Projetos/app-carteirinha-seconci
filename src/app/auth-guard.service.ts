// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(  next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): boolean {

    console.log(next);
    console.log(state.url);

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    } else if (localStorage.getItem('smsCodigoValidado') == '668799' && (state.url === '/documentos' || state.url === '/agenda')) {
      return false;
    }
    return true;
  }
}