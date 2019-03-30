import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

import { switchMap, takeWhile, map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Site, Device, TimedValue } from 'app/@core/iot-dash/iot-dash-models';
import { Observable, of } from 'rxjs';


interface SensorData {
  key: string,
  name: string,
  max: number,
  min: number,
  type: string,
  unit: string
}

interface UserData {
  key: number,
  name: string,
  email: string,
  type: string
}

const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];
interface SiteForm{
  name: string;
  sensors: [];
  actors: [];
}

@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit {


  roomForm = this.formBuilder.group({
    name: ['',Validators.required]
  });

  editMode = false;

  
  // Sensor table
  displayedSensorColumns: string[] = ['select','name', 'key','type','min', 'max'];
  sensorDataSource: MatTableDataSource<SensorData>;
  sensorsSelection = new SelectionModel<SensorData>(true, []);

  @ViewChild("pagSensor") paginatorSensor: MatPaginator;
  @ViewChild("sortSensor") sortSensor: MatSort;

  // Users table
  displayedUserColumns: string[] = ['select','name', 'email','type'];
  userDataSource: MatTableDataSource<UserData>;
  usersSelection = new SelectionModel<UserData>(true, []);

  @ViewChild("pagUser") paginatorUser: MatPaginator;
  @ViewChild("sortUser") sortUser: MatSort;

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder
  ) {
    const sensors = Array.from({length: 100}, (_, k) => createNewSensor(k + 1));
    const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.sensorDataSource = new MatTableDataSource(sensors);
    this.userDataSource = new MatTableDataSource(users);
  }

  ngOnInit() {
    this.sensorDataSource.paginator = this.paginatorSensor;
    this.sensorDataSource.sort = this.sortSensor;

    this.userDataSource.paginator = this.paginatorUser;
    this.userDataSource.sort = this.sortUser;
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

  createRoom(){
    console.log(this.sensorsSelection.selected)
    this.firebaseDatabaseService.createSite('teste23123');      
  }

  onSubmit(){
    if(this.roomForm.valid && !this.editMode){
      return this.createRoom();
    }else{
      return 
    }
  }

}

 function createNewSensor(id: number): SensorData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      key: '187323azIZAkkksj',
      name: name,
      type: 'temperatura',
      min: id,
      max: id,
      unit: '%'
    };
  }

  function createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      key: id,
      name: name,
      email: "teste@email.com",
      type: 'administrador'
    };
  }
