import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { NetworkService } from './core/services';
import { AlertDialogComponent } from './core/layouts';

@Injectable({
  providedIn: 'root'
})
export class AppNetworkGuard  {
  constructor(
    private router: Router,
    private network: NetworkService,
    private _matDialog: MatDialog,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (window.navigator.onLine) {
      return true;
    } else {
      if (!this.isConnectionLostComponent()) {
        this._matDialog.open(AlertDialogComponent).componentInstance.message = 'Connecting network lost.';
      }
      return false;
    }
  }

  private isConnectionLostComponent() {
    // check whether connection lost component is added on not
    return this.network.isActive;
  }
}
