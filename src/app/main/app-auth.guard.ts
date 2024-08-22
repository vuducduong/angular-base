import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './core/services'

@Injectable()
export class AppAuthGuard  {

    constructor(
        private _router: Router,
        private _authService: AuthService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ) {
        if (!this._authService.isValidLogin() ) {
            this._router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
        } else {
            return true;
        }

        return false;
    }
}
