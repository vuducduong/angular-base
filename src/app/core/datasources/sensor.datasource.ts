import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, finalize } from "rxjs";
import { SensorService } from "../services";

export class SensorDataSource implements DataSource<any> {
    private signalSubject = new BehaviorSubject<any>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private pagingSubject = new BehaviorSubject<any>({ length: 0 });
    private errorSubject = new BehaviorSubject<any>(null);
    public data: Array<any> = [];
    public loading$ = this.loadingSubject.asObservable();

    constructor(
        private _sensorService: SensorService
    ) {

    }

    loadData(
        page: number = 1,
        pageSize: number = 10,
        sortColumn: string = "id",
        order: string = "desc",
    ): void {
        this.loadingSubject.next(true);
        this._sensorService.getAllSensor(
            page,
            pageSize,
            sortColumn,
            order
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
        )
    }

    setData(data: any): void {
        this.data = data;
        this.signalSubject.next(this.data);
    }

    getSensorSubject(): Observable<any> {
        return this.signalSubject.asObservable();
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