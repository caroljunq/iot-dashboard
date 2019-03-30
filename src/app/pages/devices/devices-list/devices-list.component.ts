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

  displayedColumns: string[] = ['key','name','status','actor','type','max','min'];
  dataSource: MatTableDataSource<Device>;
  devices: Device[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private firebaseDatabaseService: FirebaseDatabaseService) {

    this.firebaseDatabaseService.getAllDevices().subscribe(devs =>{
      this.devices = devs;
      this.dataSource = new MatTableDataSource(this.devices);
    })

    this.dataSource = new MatTableDataSource(this.devices);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
