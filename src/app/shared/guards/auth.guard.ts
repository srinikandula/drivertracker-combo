import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '@app/shared/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const currentAccessToken = this.authService.currentUserValue;
    if (currentAccessToken) {
      if (this.authService.isAuthenticated()) {
        return true;
      }
    } else {
      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url },
      });
    }
    this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return true;
  }
}
