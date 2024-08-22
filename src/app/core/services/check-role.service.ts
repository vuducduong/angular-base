import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role } from '../helpers/enum';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CheckRoleService {
    public role: Role | null = null;
    private appLoadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private roleStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    appLoaded$: Observable<boolean> = this.appLoadedSubject.asObservable();

    constructor() { }

    /**
     * set role
     * @param role: Role
     */
    set(role: any): void {
        this.role = role;
        this.roleStatus$.next(true);
    }

    /**
     * get role status
     * @return Observable<boolean>
     */
    getRoleStatus(): Observable<boolean> {
        return this.roleStatus$.asObservable();
    }

    /**
     * get value roles
     * @return Role
     */
    get(): Role | null {
        return this.role;
    }

    /**
     * set app loaded
     * @return void
     */
    setAppLoaded(): void {
        this.appLoadedSubject.next(true);
    }

    /**
     * is admin
     * @return Promise<boolean>
     */
    async isAdmin(): Promise<boolean> {
        if (this.role === null) {
            await this.waitForAppComponent();
            return this.role === Role.ADMIN;
        }
        return this.role === Role.ADMIN;
    }

    /**
     * wait for app component
     * @return Promise<boolean>
     */
    private waitForAppComponent(): Promise<void> {
        return new Promise((resolve) => {
            this.appLoaded$
                .pipe(take(1))
                .subscribe(() => resolve());
        });
    }
}
