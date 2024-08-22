import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, finalize } from 'rxjs';
import { UserService } from '../services';

export class UserDataSource implements DataSource<any> {
    private signalSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private pagingSubject = new BehaviorSubject<any>({ length: 0 });
    private errorSubject = new BehaviorSubject<any>(null);
    public data: Array<any> = [];
    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private _userService: UserService
    ) { }

    loadData(
        page: number = 1,
        pageSize: number = 10,
        column: string = 'id',
        orderBy: string = 'desc',
    ): void {
        this.loadingSubject.next(true);
        this._userService.getAllUser(
            page,
            pageSize,
            column,
            orderBy,
        ).pipe(
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(
            res => {
                this.data = res.result;
                this.signalSubject.next(this.data);
                this.pagingSubject.next(res.totalRecords);
                this.errorSubject.next(null);
            },
            error => {
                this.errorSubject.next(error);
            }
        );
    }

    setData(data: any): void {
        this.data = data;
        this.signalSubject.next(this.data);
    }

    getPagingSubject(): Observable<any> {
        return this.pagingSubject.asObservable();
    }

    getErrorSubject(): Observable<any> {
        return this.errorSubject.asObservable();
    }

    connect(collectionViewer: CollectionViewer): Observable<any> {
        return this.signalSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.signalSubject.complete();
        this.loadingSubject.complete();
        this.pagingSubject.complete();
        this.errorSubject.complete();
    }
}
