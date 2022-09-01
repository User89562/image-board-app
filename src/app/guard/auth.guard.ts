import { LoginUtil } from './../utilities/login-util';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  loginUtil = LoginUtil;

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): true | UrlTree {
    const url = `/${route.path}`;
    console.log('g');

    return this.checkLogin(url);
  }


  checkLogin(url: string): true | UrlTree {
    if (!(this.loginUtil.retrieveKey() == '' && this.loginUtil.retrieveUrl() == '')) {
      return true;
    }



    // Redirect to the login page
    return this.router.parseUrl('/login');
  }
  
}
