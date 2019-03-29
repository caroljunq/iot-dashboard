import { Component, OnInit } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-sensor-edit',
  templateUrl: './sensor-edit.component.html',
  styleUrls: ['./sensor-edit.component.scss']
})
export class SensorEditComponent implements OnInit {

  sensorForm = this.formBuilder.group({
    name: ['',Validators.required],
    type: ['',Validators.required],
    unit: ['',Validators.required],
    max: ['',Validators.required],
    min: ['',Validators.required]
  });

  editMode = false;

  constructor(
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder,
  ){

  }

  ngOnInit() {

  }

  createDevice(){
    this.firebaseDatabaseService.createSensor({
      name: this.sensorForm.value.name,
      type: this.sensorForm.value.type,
      min: this.sensorForm.value.min,
      max: this.sensorForm.value.max,
      unit: this.sensorForm.value.unit
    })
  }

  onSubmit(){
   
    if(!this.editMode && this.sensorForm.valid){
      this.createDevice();
    }else{
      return
    }  
  }

}
