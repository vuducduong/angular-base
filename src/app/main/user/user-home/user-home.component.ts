import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserDataSource } from '../../../core/datasources/user.datasource';
import { AuthService, DataService, ListenseChartChangeService, SensorService, UserService } from '../../../core/services';
import { getTranslation } from '../../../core/helpers/pipe/translate.pipe';
import { AlertDialogComponent, ConfirmDialogComponent, SuccessDialogComponent } from '../../../core/layouts';
import { debounceTime, map, merge, Observable, Subscription, tap } from 'rxjs';
import { ListSensorDialogComponent } from '../../../core/layouts/list-sensor-dialog/list-sensor-dialog/list-sensor-dialog.component';
import { RoleList } from '../../../core/models';
import { conditionalValidators, removeAllWhitespace } from '../../../core/helpers/validate';
import { Role } from '../../../core/helpers/enum';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements AfterViewInit {
  dialogRef: MatDialogRef<any> | undefined;
  userForm: UntypedFormGroup;
  dataSource: UserDataSource;
  columnUserId: string = 'id';
  columnCopyUpdate: string = 'copy_update';
  columnUserName: string = 'username';
  columnPasswordRaw: string = 'password_raw';
  columnRole: string = 'role';
  columnChooseSensor: string = 'choose_sensor';
  displayedColumns: string[] = [
    this.columnCopyUpdate,
    this.columnUserName,
    this.columnPasswordRaw,
    this.columnRole,
    this.columnChooseSensor
  ];
  matPaginatorLength = 0;
  pageEvent: PageEvent = new PageEvent();
  pageSizeOptions: number[] = [10, 20, 50, 100];
  columnSort: string = this.columnUserId;
  orderByAsc: string = 'asc';
  orderByDesc: string = 'desc';
  orderBy: string = this.orderByDesc;
  nonUser: number = -1;
  idSelected: number = this.nonUser;
  eventChoose: string = "";
  dataListSensor: any;
  userId: number = this.nonUser;
  userName: string = "";
  dataListSensorByUser: any[] = [];
  roleUser: number = Role.USER;
  roleAdmin: number = Role.ADMIN;
  eventCopy: string = "copy";
  eventEdit: string = "edit";
  loader: boolean = false;
  listRole: RoleList[] = [
    { role: this.roleUser, nameRole: getTranslation('user') },
    { role: this.roleAdmin, nameRole: getTranslation('admin') }
  ];

  subscribeArr: Subscription[] = [];

  btnChoose: string = 'warning';
  btnNotChoose: string = 'success';

  keyFormUserName: string = 'username';
  keyFormPassword: string = 'password';
  keyFormPasswordRaw: string = 'password_raw';
  keyFormRole: string = 'role';
  keyFormUserId: string = 'user_id';
  keyFormListSensor: string = 'list_sensor';

  regex: RegExp = /^[a-zA-Z0-9]+$/;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _matDialog: MatDialog,
    private _userService: UserService,
    private _el: ElementRef,
    private _sensorService: SensorService,
    private _dataService: DataService,
    private _authService: AuthService,
    private _listenseChartChangeService: ListenseChartChangeService
  ) {
    this.dataSource = new UserDataSource(this._userService);
    this.userForm = this._formBuilder.group({
      [this.keyFormUserName]: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          removeAllWhitespace
        ],
        [this.checkUniqueUsernameAsync.bind(this)]
      ],
      [this.keyFormPassword]: ['',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          removeAllWhitespace,
          conditionalValidators(8, 20, this.regex),
        ]
      ],
      [this.keyFormRole]: [''],
    });

    this.userForm.get(this.keyFormRole)?.setValue(this.roleUser);

    this.listSensorByUser();

    this.dataSource = new UserDataSource(this._userService);

    this.dataSource.loadData();

    const subscriptionPagingSubject = this.dataSource.getPagingSubject().subscribe(res => {
      if (res != null) {
        this.matPaginatorLength = res;
      }
    });

    const subscriptionErrorSubject = this.dataSource.getErrorSubject().subscribe(res => {
      if (res != null && res.length > 0) {
        this._matDialog.open(AlertDialogComponent).componentInstance.message = res;
      }
    });

    this.listSensor();

    const currentUser = this._authService.currentUserValue;
    this.userName = currentUser.userName.toString() ? currentUser.userName.toString() : "";

    if (subscriptionPagingSubject) {
      this.subscribeArr.push(subscriptionPagingSubject);
    }
    if (subscriptionErrorSubject) {
      this.subscribeArr.push(subscriptionErrorSubject);
    }
  }

  /**
   * NgAfterViewInit
  */
  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.idSelected = this.nonUser;
          this.eventChoose = "";
          this.loadPage();
          this.resetForm();
        })
      ).subscribe();
  }

  /**
   * Check unique username async
   * @param AC
   * @return null | { 'validatorUnique': true }
  */
  checkUniqueUsernameAsync(control: AbstractControl): Observable<ValidationErrors | null> {
    const value = control.value;
    if (!value) {
      return new Observable<null>(observer => observer.next(null));
    }

    const data: any = {
      "username": value
    };

    if (this.eventChoose != this.eventCopy) {
      data["id"] = this.idSelected;
    }

    return this._userService.uniqueUsername(data).pipe(
      debounceTime(300),
      map(data => {
        return data ? { 'validatorUnique': true } : null;
      })
    );
  }

  /**
   * Load page
  */
  loadPage() {
    this.dataSource.loadData(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.columnSort,
      this.orderBy,
    );
  }

  /**
   * Page navigations
   * @param event
   * @return PageEvent
  */
  pageNavigations(event: PageEvent): PageEvent {
    this.paginator.pageSize = event.pageSize;
    return event;
  }

  /**
   * Sort data
   * @param event
   * @return void
  */
  sortData(event: any): void {
    var nameIcon = '';
    if (event.target.classList.contains('bi-arrow-down-up')) {
      var parentElement = event.srcElement.parentElement.parentElement;
      nameIcon = parentElement.getAttribute("data-icon");
      this.columnSort = parentElement.getAttribute("data-column");
    } else if (event.target.classList.contains('icon-sort')) {
      var parentElement = event.srcElement.parentElement;
      nameIcon = parentElement.getAttribute("data-icon");
      this.columnSort = parentElement.getAttribute("data-column");
    } else {
      nameIcon = event.target.getAttribute("data-icon");
      this.columnSort = event.target.getAttribute("data-column");
    }

    var tagIconSort = this._el.nativeElement.querySelector('#' + nameIcon);
    if (tagIconSort.classList.contains('pi-sort-alt')) {
      this.resetTagIcon();
      tagIconSort.classList.remove('pi-sort-alt');
      tagIconSort.classList.add('pi-sort-amount-down-alt');
      this.orderBy = 'asc';
    } else if (tagIconSort.classList.contains('pi-sort-amount-down-alt')) {
      this.resetTagIcon();
      tagIconSort.classList.remove('pi-sort-alt');
      tagIconSort.classList.add('pi-sort-amount-down');
      this.orderBy = 'desc';
    } else if (tagIconSort.classList.contains('pi-sort-amount-down')) {
      this.resetTagIcon();
      tagIconSort.classList.remove('pi-sort-alt');
      tagIconSort.classList.add('pi-sort-amount-down-alt');
      this.orderBy = 'asc';
    }

    this.resetForm();
    this.dataSource.loadData(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      this.columnSort,
      this.orderBy,
    );
  }

  /**
   * resetTagIcon
   */
  resetTagIcon(): void {
    var listIcon = document.getElementsByClassName('icon-sort');
    for (let i = 0; i < listIcon.length; i++) {
      if (listIcon[i].classList.contains('pi-sort-amount-down')) {
        listIcon[i].classList.remove('pi-sort-amount-down');
      }
      if (listIcon[i].classList.contains('pi-sort-amount-down-alt')) {
        listIcon[i].classList.remove('pi-sort-amount-down-alt');
      }
      listIcon[i].classList.add('pi-sort-alt');
    }
  }

  /**
   * Submit create user
   * @return void
  */
  submitCreateUser(): void {
    let formData = {
      [this.keyFormUserName]: this.userForm.get(this.keyFormUserName)?.value.toString().trim(),
      [this.keyFormPassword]: this.userForm.get(this.keyFormPassword)?.value.toString().trim(),
      [this.keyFormPasswordRaw]: this.userForm.get(this.keyFormPassword)?.value.toString().trim(),
      [this.keyFormRole]: this.userForm.get(this.keyFormRole)?.value,
      [this.keyFormUserId]: this.idSelected,
    };

    const dialogRef = this._matDialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.confirmMessage = getTranslation("register_in_database");
    const subscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loader = true;
        const subscription = this._userService.createUser(formData).subscribe(res => {
          this._matDialog.open(SuccessDialogComponent).componentInstance.message = getTranslation('save_successfully');
          this.resetQueryList();
          this.loadPage();
          this.idSelected = this.nonUser;
          this.eventChoose = "";
          this.resetForm();
          this.loader = false;

        }, error => {
          this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
          this.loader = false;
        });
        this.subscribeArr.push(subscription);
      }
    });
    this.subscribeArr.push(subscription);
  }

  /**
   * Reset query list
   * @return void
  */
  resetQueryList() {
    this.columnSort = this.columnUserId;
    this.orderBy = this.orderByDesc;
    this.resetTagIcon();
  }

  /**
   * Submit edit user
   * @return void
  */
  submitEditUser(): void {
    const formData = {
      [this.keyFormUserName]: this.userForm.get(this.keyFormUserName)?.value.toString().trim(),
      [this.keyFormPassword]: this.userForm.get(this.keyFormPassword)?.value.toString().trim(),
      [this.keyFormPasswordRaw]: this.userForm.get(this.keyFormPassword)?.value.toString().trim(),
      [this.keyFormRole]: this.userForm.get(this.keyFormRole)?.value,
    }

    const dialogRef = this._matDialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.confirmMessage = getTranslation("update_in_database");
    const subscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loader = true;
        const subscription = this._userService.updateUser(this.idSelected, formData).subscribe(res => {
          this.resetQueryList();
          this.loadPage();
          this.resetForm();
          this.idSelected = this.nonUser;
          this.eventChoose = "";
          this._matDialog.open(SuccessDialogComponent).componentInstance.message = getTranslation('update_successfully');
          this.loader = false;
        }, error => {
          this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
          this.loader = false;
        });
        this.subscribeArr.push(subscription);
      }
    });
    this.subscribeArr.push(subscription);
  }

  /**
   * Choose user
   * @param user
   * @param event
   * @return void
  */
  chooseUser(user: any, event: string): void {
    this.resetForm();
    var userId = user.id;
    var username = user.username;
    var passwordRaw = user.password_raw;
    var textChoose = this._el.nativeElement.querySelector('#text-choose');
    var btnCopy = this._el.nativeElement.querySelector('#copy-user-' + userId);
    var userChoose = this._el.nativeElement.querySelector('#user-' + userId);
    var btnEdit = this._el.nativeElement.querySelector('#edit-user-' + userId);
    if (this.idSelected == userId && this.eventChoose == event) {

      this.idSelected = this.nonUser;
      btnCopy.classList.add(this.btnNotChoose);
      btnCopy.classList.remove(this.btnChoose);
      btnEdit.classList.add(this.btnNotChoose);
      btnEdit.classList.remove(this.btnChoose);
      textChoose.textContent = "";
      this.eventChoose = "";
      userChoose.classList.remove('selected');
    } else {
      this.resetSelected();
      this.idSelected = userId;
      this.eventChoose = event;
      userChoose.classList.add('selected');
      this.userForm.get(this.keyFormUserName)?.setValue(username);
      this.userForm.get(this.keyFormPassword)?.setValue(passwordRaw);
      this.userForm.get(this.keyFormRole)?.setValue(user.role);
      if (event == this.eventCopy) {
        btnCopy.classList.remove(this.btnNotChoose);
        btnCopy.classList.add(this.btnChoose);
        btnEdit.classList.add(this.btnNotChoose);
        btnEdit.classList.remove(this.btnChoose);
        textChoose.textContent = username + getTranslation('information_copy_mode');
      }

      if (event == this.eventEdit) {
        btnCopy.classList.add(this.btnNotChoose);
        btnCopy.classList.remove(this.btnChoose);
        btnEdit.classList.remove(this.btnNotChoose);
        btnEdit.classList.add(this.btnChoose);
        textChoose.textContent = username + getTranslation('edit_information_mode');
      }
    }
  }

  /**
   * Reset form
   * @return void
  */
  resetForm(): void {
    this.userForm.reset();
    this.userForm.get(this.keyFormRole)?.setValue(this.roleUser);
  }

  /**
   * Reset selected
  */
  resetSelected() {
    let listSelected = document.getElementsByClassName("element-user");
    let btnCopy = document.getElementsByClassName("btn-copy");
    let btnEdit = document.getElementsByClassName("btn-edit");
    for (let i = 0; i < listSelected.length; i++) {
      if (listSelected[i].classList.contains('selected')) {
        listSelected[i].classList.remove('selected');
        btnCopy[i].classList.remove(this.btnChoose);
        btnCopy[i].classList.add(this.btnNotChoose);
        btnEdit[i].classList.remove(this.btnChoose);
        btnEdit[i].classList.add(this.btnNotChoose);
      }
    }
  }

  /**
   * List sensor dialog
   * @param userId
   * @param username
  */
  listSensorDialog(userId: number, username: string) {
    const dialogListSensor = this._matDialog.open(ListSensorDialogComponent, {
      width: '500px',
      data: {
        [this.keyFormUserName]: username,
        [this.keyFormUserId]: userId,
        [this.keyFormListSensor]: this.dataListSensor != null ? this.dataListSensor : []
      },
    });
    const subscription = dialogListSensor.afterClosed().subscribe(async (res) => {
      if (res) {
        let formData = { [this.keyFormListSensor]: res.data };
        if (username == this.userName) {
          this.dataListSensorByUser = res.dataSensor;
          this._dataService.setUserSensorData(this.dataListSensorByUser);
        }
        this._userService.updateRelationship(userId, formData).subscribe(
          (res) => {
            this._matDialog.open(SuccessDialogComponent).componentInstance.message = getTranslation("update_successfully");
            this._listenseChartChangeService.sendMessage(null);
          },
          (error) => {
            this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
          }
        );
      }
    });
    this.subscribeArr.push(subscription);
  }

  /**
   * List sensor
   * @return void
  */
  listSensor(): void {
    this._sensorService.getListSensor().subscribe(res => {
      this.dataListSensor = res;
    }, error => {
    });
  }

  /**
   * Delete user dialog
   * @return void
  */
  deleteUserDialog(): void {
    let countDataPage = this.dataSource.data.length;
    const dialogRef = this._matDialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.confirmMessage = getTranslation('delete_in_database');
    const subscription = dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._userService.deleteUser(this.idSelected).subscribe(res => {
          if (countDataPage == 1) {
            this.paginator.pageIndex = this.paginator.pageIndex - 1;
          }
          this.loadPage();
          this._matDialog.open(SuccessDialogComponent).componentInstance.message = getTranslation('delete_successfully');
          this.idSelected = this.nonUser;
          this.eventChoose = "";
          this.resetForm();
        }, error => {
          this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
        });
        this.subscribeArr.push(subscription);
      }
    });
  }

  /**
   * Get column string
   * @param element
   * @param columnName
   * @return string
  */
  getColumnString(element: any, columnName: string): string {
    return element && element[columnName] != null ? element[columnName].toString() : '';
  }

  /**
   * Get column int
  */
  getColumnInt(element: any, columnName: string): number {
    return element && element[columnName] != null ? element[columnName] : 0;
  }

  /**
   * List sensor by user
   * @param userId
   * @return void
  */
  listSensorByUser(userId: number | null = null): void {
    const subscription = this._sensorService.getListSensorByUser(userId).subscribe(res => {
      this.dataListSensorByUser = res;
      this._dataService.setUserSensorData(this.dataListSensorByUser);
    }, error => {
      this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
    });
    this.subscribeArr.push(subscription);
  }

  /**
   * cleanup subscriptions
   */
  cleanupSubscriptions() {
    this.subscribeArr.forEach((subscription) => {
      if (subscription && !subscription.closed) {
        subscription.unsubscribe();
      }
    });
    this.subscribeArr = [];
  }

  /**
   * on destroy
   */
  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }
}
