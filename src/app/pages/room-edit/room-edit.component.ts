import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

import { switchMap, takeWhile, map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Site } from 'app/@core/iot-dash/iot-dash-models';
import { Observable, of } from 'rxjs';

// Toast
import { NbGlobalLogicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

interface SensorData {
  key: string;
  name: string;
  max: number;
  min: number;
  type: string;
  unit: string;
}

interface UserData {
  key: number;
  name: string;
  email: string;
  type: string;
}

const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth',
];

interface SiteForm {
  name: string;
  sensors: [];
  actors: [];
}

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
  displayedSensorColumns: string[] = ['select', 'name', 'key', 'type', 'min', 'max'];
  sensorDataSource: MatTableDataSource<SensorData>;
  sensorsSelection = new SelectionModel<SensorData>(true, []);

  @ViewChild('pagSensor') paginatorSensor: MatPaginator;
  @ViewChild('sortSensor') sortSensor: MatSort;

  // Users table
  displayedUserColumns: string[] = ['select', 'name', 'email', 'type'];
  userDataSource: MatTableDataSource<UserData>;
  usersSelection = new SelectionModel<UserData>(true, []);

  @ViewChild('pagUser') paginatorUser: MatPaginator;
  @ViewChild('sortUser') sortUser: MatSort;

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
  ) {

    this.saveBtn = true;

    this.route.paramMap.pipe(
      switchMap<ParamMap, Site>(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          this.editMode = true;
          // return this.firebaseDatabaseService.getSiteById(id);
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

        this.sensorDataSource = new MatTableDataSource(sensors);
        this.userDataSource = new MatTableDataSource(users);

        this.sensorDataSource.paginator = this.paginatorSensor;
        this.sensorDataSource.sort = this.sortSensor;

        this.userDataSource.paginator = this.paginatorUser;
        this.userDataSource.sort = this.sortUser;

      },
    );

    const sensors = []
    const users = []
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

  checkboxSensorLabel(row?: SensorData): string {
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

  checkboxUserLabel(row?: UserData): string {
    if (!row) {
      return `${this.isAllUserSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.usersSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.key}`;
  }

  async createRoom() {
    try{
      const selectedDevices = this.sensorsSelection.selected.reduce((obj, item) => {
         obj[item.key] = item.key
         return obj
      }, {});
      const createSite = await this.firebaseDatabaseService.createSite({
        name: this.roomForm.value.name,
        key: '',
        devices: selectedDevices
      });
      this.saveBtn = false;
      this.showToast('Room created.', 'SUCCESS', NbToastStatus.SUCCESS);
      // this.router navigateByUrl(/rooms/id do role)
    }catch(e){
      this.saveBtn = true;
      this.showToast('Room not created. Try again.', 'WARNING', NbToastStatus.DANGER);
    }
  }

  onSubmit() {
    if (this.roomForm.valid && !this.editMode) {
      return this.createRoom();
    }

    if (this.editMode && this.roomForm.valid) {
      // this.updateRoom();
      console.log("updateRoom")
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
