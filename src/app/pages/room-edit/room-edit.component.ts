import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

import { switchMap, takeWhile, map, take } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Site, Device, StoredUser } from 'app/@core/iot-dash/iot-dash-models';
import { Observable, of } from 'rxjs';

import { UsersService } from 'app/pages/users/users.service';


// Toast
import { NbGlobalLogicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss'],
})

export class RoomEditComponent implements OnInit {

  // toast config
  destroyByClick = false;
  duration = 4000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
  preventDuplicates = false;

  roomForm = this.formBuilder.group({
    name: ['', Validators.required],
  });

  editMode = false;
  saveBtn = true;
  siteKey: string = '';

  // Sensor table
  displayedSensorColumns: string[] = ['select', 'name', 'key', 'type', 'min', 'max','actor'];
  sensorDataSource: MatTableDataSource<Device> = new MatTableDataSource([]);
  sensorsSelection = new SelectionModel<Device>(true, []);

  @ViewChild('pagSensor') paginatorSensor: MatPaginator;
  @ViewChild('sortSensor') sortSensor: MatSort;

  // Users table
  displayedUserColumns: string[] = ['select', 'name', 'email', 'admin'];
  userDataSource: MatTableDataSource<StoredUser> = new MatTableDataSource([]);
  usersSelection = new SelectionModel<StoredUser>(true, []);

  @ViewChild('pagUser') paginatorUser: MatPaginator;
  @ViewChild('sortUser') sortUser: MatSort;

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
    private usersService: UsersService
  ) {

    this.saveBtn = true;

    this.route.paramMap.pipe(
      switchMap<ParamMap, Site>(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          this.editMode = true;
          return this.firebaseDatabaseService.getSite(id);
        }
        return of(<Site>{
          key: '',
          name: '',
          devices: {},
        });
      }),
    ).subscribe(
      (site) => {
        this.siteKey = site.key;
        // sensorsSelection iniciar valores
        // usersSelection // initciar valores
        this.roomForm.setValue({
          name: site.name,
        });
      },
    );

    // get the data once
    this.firebaseDatabaseService.getAllDevices().pipe(take(1))
      .subscribe((sensors) => {
        this.sensorDataSource.data = sensors;
        this.sensorDataSource.paginator = this.paginatorSensor;
        this.sensorDataSource.sort = this.sortSensor;
      })
    // get the data once, 2 --> get startWith from getUsersList, after all users at 2nd
    this.usersService.getUsersList().pipe(take(2))
      .subscribe((users) => {
        this.userDataSource.data = users;
        this.userDataSource.paginator = this.paginatorUser;
        this.userDataSource.sort = this.sortUser;
      })
  }

  ngOnInit() {
  }

  applyFilterSensor(filterValue: string) {
    this.sensorDataSource.filter = filterValue.trim().toLowerCase();

    if (this.sensorDataSource.paginator) {
      this.sensorDataSource.paginator.firstPage();
    }
  }

  isAllSensorSelected() {
    const numSelected = this.sensorsSelection.selected.length;
    const numRows = this.sensorDataSource.data.length;
    return numSelected === numRows;
  }

  masterSensorToggle() {
    this.isAllSensorSelected() ?
        this.sensorsSelection.clear() :
        this.sensorDataSource.data.forEach(row => this.sensorsSelection.select(row));
  }

  checkboxSensorLabel(row?: Device): string {
    if (!row) {
      return `${this.isAllSensorSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.sensorsSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.key}`;
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

  async createRoom() {
    try{
      const selectedDevices = this.sensorsSelection.selected.reduce((obj, item) => {
         obj[item.key] = item.key
         return obj
      }, {});

      const selectedUsers = this.usersSelection.selected.reduce((arr, item) => {
         arr.push(item.uid);
         return arr;
      }, []);

      const newSiteKey = await this.firebaseDatabaseService.createSite({
        name: this.roomForm.value.name,
        key: '',
        devices: selectedDevices
      }).key

      const createSiteUsers = await this.firebaseDatabaseService.insertMultipleSiteUsers(newSiteKey,selectedUsers);

      this.saveBtn = false;
      this.showToast('Room created.', 'SUCCESS', NbToastStatus.SUCCESS);
      // this.router navigateByUrl(/rooms/id do role) dashboard do role
    }catch(e){
      this.saveBtn = true;
      this.showToast('Room not created. Try again.', 'WARNING', NbToastStatus.DANGER);
    }
  }

  async updateRoom() {
    try{
      const selectedDevices = this.sensorsSelection.selected.reduce((obj, item) => {
         obj[item.key] = item.key
         return obj
      }, {});

      const createSite = await this.firebaseDatabaseService.createSite({
        name: this.roomForm.value.name,
        key: this.siteKey,
        devices: selectedDevices
      });

      this.showToast('Room updated.', 'SUCCESS', NbToastStatus.SUCCESS);
      // this.router navigateByUrl(/rooms/id do role)
      // navegar para o dashboard desse id
    }catch(e){
      this.showToast('Room not updated. Try again.', 'WARNING', NbToastStatus.DANGER);
    }
  }

  onSubmit() {
    if (this.roomForm.valid && !this.editMode) {
      return this.createRoom();
    }

    if (this.editMode && this.roomForm.valid) {
      this.updateRoom();
    }
  }

  showToast(message: string, title: string, status: NbToastStatus) {

    const config = {
      status: status,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };

    this.toastrService.show(message, title, config);

    // this.showToast('Device created.', 'SUCCESS', NbToastStatus.SUCCESS);
    // this.showToast('Device not created. Try again.', 'WARNING', NbToastStatus.DANGER);
  }
}
