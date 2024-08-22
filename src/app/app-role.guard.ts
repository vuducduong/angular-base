import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CheckRoleService } from './core/services';

@Injectable()
export class AppRoleGuard {
    constructor(
        private _router: Router,
        private _checkRoleService: CheckRoleService
    ) { }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const canActivate = await this._checkRoleService.isAdmin();
        if (canActivate) {
            return true;
        } else {
            this._router.navigate(['/forbidden']);
            return false;
        }
    }
}
