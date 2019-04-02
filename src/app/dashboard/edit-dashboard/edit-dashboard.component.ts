
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Subscription, of, combineLatest, Observable } from 'rxjs';
import { switchMap, takeWhile, map, take } from 'rxjs/operators';

import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Site, Device, StoredUser } from 'app/@core/iot-dash/iot-dash-models';
import { UsersService } from 'app/pages/users/users.service';
import { ToastService, NbToastStatus } from 'app/@theme/toast.service';

import { DashboardService, EditableSite } from '../dashboard.service';

@Component({
  selector: 'app-room-edit',
  templateUrl: './edit-dashboard.component.html',
  styleUrls: ['./edit-dashboard.component.scss'],
})

export class EditViewDashboardComponent implements OnInit, OnDestroy {
  roomForm = new FormGroup({
    name: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
  });

  editMode = false;
  loaded = false;

  // Device table
  displayedDeviceColumns: string[] = ['select', 'name', 'type', 'min', 'max', 'actor'];
  deviceDataSource = new MatTableDataSource<Device>([]);
  devicesSelection = new SelectionModel<Device>(true, []);

  @ViewChild('pagDevice') paginatorDevice: MatPaginator;
  @ViewChild('sortDevice') sortDevice: MatSort;

  // Users table
  displayedUserColumns: string[] = ['select', 'name', 'email', 'admin'];
  userDataSource = new MatTableDataSource<StoredUser>([]);
  usersSelection = new SelectionModel<StoredUser>(true, []);

  @ViewChild('pagUser') paginatorUser: MatPaginator;
  @ViewChild('sortUser') sortUser: MatSort;

  siteSubscription: Subscription;
  site: EditableSite;

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected toastService: ToastService,
    private usersService: UsersService,
    protected dashboardService: DashboardService,
  ) {
    this.siteSubscription = combineLatest(
      this.route.paramMap,
      this.dashboardService.getAllDevices().pipe(map(devices => devices.filter(device => device.isActive))),
      this.usersService.getUsersList(),
    ).pipe(
      switchMap(([paramMap, allDevices, allUsers]) => {
        const id = paramMap.get('id');
        let siteObservable: Observable<EditableSite>;
        if (id) {
          this.editMode = true;
          siteObservable = this.dashboardService.getEditableSite(id);
        } else {
          siteObservable = of(null);
        }
        return siteObservable.pipe(map(site => ({site, allDevices, allUsers})));
      }),
    ).subscribe(
      ({site, allDevices, allUsers}) => {
        this.loaded = true;
        this.site = site;
        this.deviceDataSource.data = allDevices;
        this.userDataSource.data = allUsers;
        if (site) {
          this.roomForm.setValue({
            name: site.name,
          });
          this.usersSelection.select(
            ...allUsers.filter(allUser => !!site.usersArray.find(user => user.uid === allUser.uid)),
          );
          this.devicesSelection.select(
            ...allDevices.filter(allDevice => !!site.devicesArray.find(device => device.key === allDevice.key)),
          );
        }
      },
      // error => console.log('error', error),
      // () => console.log('complete'),
    );
  }

  ngOnInit() { }
  ngOnDestroy(): void {
    this.siteSubscription.unsubscribe();
  }

  onDelete() {
    //
  }
  onSubmit() {
    if (this.roomForm.invalid) {
      return;
    }
    if (!this.editMode) {
      this.dashboardService.createsite(
        {
          key: '',
          name: this.roomForm.value.name,
          devices: {},
        },
        this.usersSelection.selected,
        this.devicesSelection.selected,
      );
    } else {
      this.dashboardService.updateSite(
        {
          ...this.site,
          name: this.roomForm.value.name,
        },
        this.usersSelection.selected,
        this.devicesSelection.selected,
      );
    }
  }

  onDevicesSelectionChange($event, device: Device) {
    if (!$event) {
      return null;
    }
    this.devicesSelection.toggle(device);
    if (!this.editMode) {
      return null;
    }
    if (this.devicesSelection.isSelected(device)) {
      this.dashboardService.addDeviceToSite(this.site, device);
    } else {
      this.dashboardService.removeDeviceFromSite(this.site, device);
    }
  }
  onUsersSelectionChange($event, user: StoredUser) {
    if (!$event) {
      return null;
    }
    this.usersSelection.toggle(user);
    if (!this.editMode) {
      return null;
    }
    if (this.usersSelection.isSelected(user)) {
      this.dashboardService.addUserToSite(this.site, user);
    } else {
      this.dashboardService.removeUserFromSite(this.site, user);
    }
  }

  applyFilterDevice(filterValue: string) {
    this.deviceDataSource.filter = filterValue.trim().toLowerCase();

    if (this.deviceDataSource.paginator) {
      this.deviceDataSource.paginator.firstPage();
    }
  }

  isAllDeviceSelected() {
    const numSelected = this.devicesSelection.selected.length;
    const numRows = this.deviceDataSource.data.length;
    return numSelected === numRows;
  }

  masterDeviceToggle() {
    this.isAllDeviceSelected() ?
        this.devicesSelection.clear() :
        this.deviceDataSource.data.forEach(row => this.devicesSelection.select(row));
  }

  checkboxDeviceLabel(row?: Device): string {
    if (!row) {
      return `${this.isAllDeviceSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.devicesSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.name}`;
  }


  applyFilterUser(filterValue: string) {
    this.userDataSource.filter = filterValue.trim().toLowerCase();

    if (this.userDataSource.paginator) {
      this.userDataSource.paginator.firstPage();
    }
  }

  isAllUserSelected() {
    const numSelected = this.usersSelection.selected.length;
    const numRows = this.userDataSource.data.length;
    return numSelected === numRows;
  }

  masterUserToggle() {
    this.isAllUserSelected() ?
        this.usersSelection.clear() :
        this.userDataSource.data.forEach(row => this.usersSelection.select(row));
  }

  checkboxUserLabel(row?: StoredUser): string {
    if (!row) {
      return `${this.isAllUserSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.usersSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.uid}`;
  }
}
