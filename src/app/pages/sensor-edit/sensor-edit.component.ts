import { Component, OnInit } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

import { switchMap, takeWhile, map } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Device, TimedValue } from 'app/@core/iot-dash/iot-dash-models';
import { Observable, of } from 'rxjs';

//Toast
import { NbGlobalLogicalPosition, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

interface SensorForm {
  name: string;
  type: string;
  unit: string;
  max: number;
  min: number;
  isActor: boolean
}

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
    min: ['',Validators.required],
    isActor: [false]
  });

  editMode = false;
  sensorKey: string = '';

  saveBtn = true;

  //toast config
  destroyByClick = false;
  duration = 3000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
  preventDuplicates = false;

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router
  ){
    this.saveBtn = true;

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
          isActor: false,
        });
      }),
    ).subscribe(
      (sensor) =>{ 
        this.sensorKey = sensor.key,
        this.sensorForm.setValue({
          name: sensor.name,
          type: sensor.type,
          unit: sensor.unit,
          max: sensor.max,
          min: sensor.min,
          isActor: sensor.isActor
        })
      },
    );
  }

  ngOnInit() {

  }

  showToast(message: string,title: string,status: NbToastStatus) {

    const config = {
      status: status,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };

    this.toastrService.show(message,title,config);
  }

  async createDevice(){
    try {
      let newDevice = await this.firebaseDatabaseService.createDevice({
        name: this.sensorForm.value.name,
        type: this.sensorForm.value.type,
        min: this.sensorForm.value.min,
        max: this.sensorForm.value.max,
        unit: this.sensorForm.value.unit,
        isActor: this.sensorForm.value.isActor
      })
      this.saveBtn = false;
      this.showToast('Device created.','SUCCESS',NbToastStatus.SUCCESS);
      this.router.navigateByUrl('/rooms');
    } catch(e) {
      this.saveBtn = true;
      this.showToast('Device not created. Try again.','WARNING',NbToastStatus.DANGER);
    }
  }

  onSubmit(){
    if(!this.editMode && this.sensorForm.valid){
      this.createDevice();
    }else{
      return
    }  
  }

}
