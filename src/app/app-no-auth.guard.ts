import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './core/services'

@Injectable()
export class AppNoAuthGuard  {

    constructor(
        private _router: Router,
        private _authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const currentUser = this._authService.currentUserValue;
		if (currentUser) {
			this._router.navigateByUrl('dashboard');
			return false;
		} else {
            return true;
        }
	}
}
