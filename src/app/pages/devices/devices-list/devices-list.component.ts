import { Component, OnInit, ViewChild } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Device } from 'app/@core/iot-dash/iot-dash-models';
import { Router } from '@angular/router';

// Toast
import { NbGlobalLogicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

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

  // toast config
  destroyByClick = false;
  duration = 4000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
  preventDuplicates = false;

  constructor(
    private firebaseDatabaseService: FirebaseDatabaseService,
    private toastrService: NbToastrService,
    private router: Router,
  ) {

    this.firebaseDatabaseService.getAllDevices().subscribe(devs =>{
      this.devices = devs;
      this.dataSource = new MatTableDataSource(this.devices);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    this.dataSource = new MatTableDataSource(this.devices);
  }

  ngOnInit() {

  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClicked(row: Device){
    try{
      this.router.navigateByUrl(`/sensors/${row.key}`);
    }catch(e){
      this.showToast("Sensor can not be displayed.","WARNING", NbToastStatus.DANGER);
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
  }
}
