import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import { Device } from 'app/@core/iot-dash/iot-dash-models';

@Component({
  selector: 'app-devices-list',
  templateUrl: './devices-list.component.html',
  styleUrls: ['./devices-list.component.scss']
})

export class DevicesListComponent implements OnInit {

  devices = [];
  displayedDeviceColumns: string[] = ['key','name','status','actor','type','min', 'max'];
  devicesDataSource: MatTableDataSource<Device>;

  @ViewChild(MatPaginator) paginatorDevice: MatPaginator;
  @ViewChild(MatSort) sortDevice: MatSort;

  constructor(
    private firebaseDatabaseService: FirebaseDatabaseService,
  ){
    // this.firebaseDatabaseService.getAllDevices().subscribe(devs =>
    //   console.log(devs))
  }

  ngOnInit() {
    this.devicesDataSource.paginator = this.paginatorDevice;
    this.devicesDataSource.sort = this.sortDevice;
  }

  applyFilterDevice(filterValue: string) {
    this.devicesDataSource.filter = filterValue.trim().toLowerCase();

    if (this.devicesDataSource.paginator) {
      this.devicesDataSource.paginator.firstPage();
    }
  }

}
