import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sensor-edit',
  templateUrl: './sensor-edit.component.html',
  styleUrls: ['./sensor-edit.component.scss']
})
export class SensorEditComponent implements OnInit {

  constructor() { }

  editMode = false;
  
  ngOnInit() {
  }

}
