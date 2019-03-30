import { Component, OnInit } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';

@Component({
  selector: 'app-sensor-list',
  templateUrl: './sensor-list.component.html',
  styleUrls: ['./sensor-list.component.scss']
})
export class SensorListComponent implements OnInit {

  constructor(
    private firebaseDatabaseService: FirebaseDatabaseService, 
  ){
    this.firebaseDatabaseService.getAllSensors().subscribe(res => console.log(res))
    
  }

  ngOnInit() {
  }

}
