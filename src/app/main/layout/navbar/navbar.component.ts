import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { AuthService, CheckRoleService, DataService, SensorService } from "../../../core/services";
import { AlertDialogComponent, SuccessDialogComponent } from "../../../core/layouts";
import { Subscription } from 'rxjs';
import { getTranslation } from '../../../core/helpers/pipe';
import { Role } from '../../../core/helpers/enum';
import moment from 'moment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {

  // private _mobileQueryListener: () => void;
  // mobileQuery: MediaQueryList;
  userName: string = '';

  @ViewChild('sidenav')
  sidenav!: SidebarModule;
  isExpanded = true;
  isShowing = false;
  showSubmenu: boolean = false;
  showSubmenuSensorDetail: boolean = false;
  rotateRewind: boolean = false;
  messages: string[] = [];
  checkFlagConnect: boolean = false;
  widthResize: any = '100%';
  listSidebar: any[] = [];
  listSidebarUpdate: any[] = [];
  isCheckRole: boolean = false;
  countAlert: any = '';
  isDashboardDevice: boolean = false;
  urlDashboard: string = '/dashboard';
  role: Role | null = Role.USER;
  roleAdmin: Number = Role.ADMIN;
  dataSensorByAuth: any[] = [];
  userId: Number | null = null;
  sidenavHeader: string = "sidenavHeader";
  sidenavFooter: string = "sidenavFooter";
  sensorId: Number | null = null;
  subscribeArr: Subscription[] = [];
  currentYear: string;
  copyRight: string = '';

  constructor(
    private _route: ActivatedRoute,
    public _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
    private _authService: AuthService,
    private _dataService: DataService,
    private _sensorService: SensorService,
    private _roleService: CheckRoleService,
  ) {
    // this.mobileQuery = this._media.matchMedia('(max-width: 1000px)');
    // this._mobileQueryListener = () => _changeDetectorRef.detectChanges();
    // this.mobileQuery.addListener(this._mobileQueryListener);

    // if (this.mobileQuery.matches) {
    //   this.rotateRewind = false;
    //   this.isExpanded = false;
    // }

    const subscriptionUserSensor = this._dataService.getUserSensorData().subscribe((data) => {
      this.dataSensorByAuth = data;
    });

    this.subscribeArr.push(subscriptionUserSensor);

    const subscriptionSensorActive = this._route.queryParams.subscribe(params => {
      if (params['reload']) {
        this._router.navigate(['/sensor-detail', this._route.snapshot.params['id']]);
        this.sensorId = this._route.snapshot.params['id'];
      }
    });
    this.subscribeArr.push(subscriptionSensorActive);
    this.currentYear = moment().format('YYYY');
    this.copyRight = getTranslation('copy_right').replace('YYYY', this.currentYear);
  }

  ngOnInit(): void {
    this.isDashboardDevice = false;
    if (!this._authService.isValidLogin()) {
      this._router.navigate(['/auth/login']);
    } else {
      let url = this._router.url.replace(/^\/+/g, "").replace(/\/+$/g, "");

      if (url.length) {
        let urls = url.split('/');

        if (urls[0] == 'setting' || urls[0] == 'user' || urls[0] == 'alarm-setting' || urls[0] == 'sensor' ||
          urls[0] == 'delete-data' || urls[0] == 'export-csv') {
          this.showSubmenu = true;
        }

        if (urls[0].includes('sensor-detail')) {
          this.showSubmenuSensorDetail = true;
        }
      }
      const currentUser = this._authService.currentUserValue;
      this.userName = currentUser.userName.toString() ? currentUser.userName.toString() : 'User';
      this.userId = currentUser.userId ? currentUser.userId : null;
      this.checkRole();
    }
    this.sensorId = this._route.snapshot.params['id'];
    if (this.showSubmenuSensorDetail) {
      this.listSensorByUser(this.userId);
    }
  }

  /**
   * check role
   */
  checkRole() {
    this._roleService.getRoleStatus().subscribe(status => {
      if (status && !this.isCheckRole) {
        this.role = this._roleService.get();
        this.isCheckRole = true;
      }
    })
  }

  /**
   * Handler Click Sensor Detail
   */
  handlerClickSensorDetail() {
    this.showSubmenuSensorDetail = !this.showSubmenuSensorDetail;
    this.showSubmenu = false;
    this.isExpanded = true;
    if (this.showSubmenuSensorDetail) {
      this.listSensorByUser(this.userId);
    }
  }

  /**
   * After View Init
   */
  ngAfterViewInit(): void {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * logout
   */
  logout(): void {
    localStorage.removeItem("currentUser");
    this._router.navigate(['/auth/login']);
    // this._matDialog.open(SuccessDialogComponent).componentInstance.message = getTranslation('logout_successfully');
  }

  /**
   * resize
   * @param event
   * @param sidenav
   */
  onResize(event: Event, sidenav: any) {
    // if (this.mobileQuery.matches) {
    //   this.rotateRewind = true;
    //   this.isExpanded = false;
    // } else {
    //   sidenav.toggle(true);
    // }
  }

  /**
   * Toggle Side nav
   * @param sidenav
   */
  toggleSidenav(sidenav: any, element: string) {
    // if (this.mobileQuery.matches) {
    //   if (element == this.sidenavHeader) {
    //     sidenav.toggle();
    //   }

    //   if (element == this.sidenavFooter) {
    //     sidenav.toggle(true);
    //     this.isExpanded = !this.isExpanded;
    //     this.rotateRewind = !this.rotateRewind;
    //   }
    // } else {
    //   sidenav.toggle(true);
    //   this.isExpanded = !this.isExpanded;
    //   this.rotateRewind = !this.rotateRewind;
    // }
  }

  /**
   * Handle Rotate Rewind
   */
  handleRotateRewind() {
    this.rotateRewind = !this.rotateRewind;
  }

  /**
   * List Sensor By User
   * @param userId
   * @returns void
   */
  listSensorByUser(userId: Number | null): void {
    this._sensorService.getListSensorByUser(userId).subscribe(res => {
      this.dataSensorByAuth = res;
    }, error => {
      // this._matDialog.open(AlertDialogComponent).componentInstance.message = error;
    });
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
    // this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
