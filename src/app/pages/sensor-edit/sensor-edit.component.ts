import { Component, OnInit } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

import { switchMap, takeWhile, map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Device, TimedValue } from 'app/@core/iot-dash/iot-dash-models';
import { Observable, of } from 'rxjs';


interface SensorForm {
  name: string;
  type: string;
  unit: string;
  max: number;
  min: number;
}

@Component({
  selector: 'app-sensor-edit',
  templateUrl: './sensor-edit.component.html',
  styleUrls: ['./sensor-edit.component.scss'],
})
export class SensorEditComponent implements OnInit {

  sensorForm = this.formBuilder.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    unit: ['', Validators.required],
    max: ['', Validators.required],
    min: ['', Validators.required],
  });

  editMode = false;
  sensorKey: string = '';

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder,
  ) {
    this.route.paramMap.pipe(
      switchMap<ParamMap, Device>(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          this.editMode = true;
          return this.firebaseDatabaseService.getSensorById(id);
        }
        return of(<Device>{
          key: '',
          name: '',
          type: '',
          unit: '',
          max: null,
          min: null,
        });
      }),
      ).subscribe(
      (sensor) => {
        this.sensorKey = sensor.key,
        this.sensorForm.setValue({
          name: sensor.name,
          type: sensor.type,
          unit: sensor.unit,
          max: sensor.max,
          min: sensor.min,
        });
      },
    );

  }

  ngOnInit() { }

  createDevice() {
    this.firebaseDatabaseService.createSensor(<Device>{
      key: null,
      name: this.sensorForm.value.name,
      type: this.sensorForm.value.type,
      min: this.sensorForm.value.min,
      max: this.sensorForm.value.max,
      unit: this.sensorForm.value.unit,
    });
  }

  onSubmit() {
    if (!this.editMode && this.sensorForm.valid) {
      this.createDevice();
    } else {
      return;
    }
  }

}
