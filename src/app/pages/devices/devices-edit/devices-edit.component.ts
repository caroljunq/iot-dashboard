import { Component, OnInit } from '@angular/core';
import { FirebaseDatabaseService } from 'app/@core/iot-dash/firebase-database.service';
import { Validators, FormBuilder } from '@angular/forms';

import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Device } from 'app/@core/iot-dash/iot-dash-models';
import { Observable, of } from 'rxjs';

// Toast
import { NbGlobalLogicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { NbToastStatus } from '@nebular/theme/components/toastr/model';

@Component({
  selector: 'app-devices-edit',
  templateUrl: './devices-edit.component.html',
  styleUrls: ['./devices-edit.component.scss']
})
export class DevicesEditComponent implements OnInit {

  sensorForm = this.formBuilder.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    unit: ['', Validators.required],
    max: ['', Validators.required],
    min: ['', Validators.required],
    isActor: [false],
    isActive: [true],
  });

  editMode = false;
  sensorKey: string = '';
  sensorStatus: boolean = true;

  saveBtn = true;

  // toast config
  destroyByClick = false;
  duration = 4000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalLogicalPosition.BOTTOM_END;
  preventDuplicates = false;

  constructor(
    protected route: ActivatedRoute,
    private firebaseDatabaseService: FirebaseDatabaseService,
    protected formBuilder: FormBuilder,
    private toastrService: NbToastrService,
    private router: Router,
  ) {
    this.saveBtn = true;

    this.route.paramMap.pipe(
      switchMap<ParamMap, Device>(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          this.editMode = true;
          return this.firebaseDatabaseService.getDeviceById(id);
        }
        return of(<Device>{
          key: '',
          name: '',
          type: '',
          unit: '',
          max: null,
          min: null,
          isActor: false,
          isActive: true,
        });
      }),
    ).subscribe(
      (sensor) => {
        this.sensorStatus = sensor.isActive;
        this.sensorKey = sensor.key;
        this.sensorForm.setValue({
          name: sensor.name,
          type: sensor.type,
          unit: sensor.unit,
          max: sensor.max,
          min: sensor.min,
          isActor: sensor.isActor,
          isActive: sensor.isActive,
        });
      },
    );
  }

  ngOnInit() {

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

  async createDevice() {
    try {
      const newDevice = await this.firebaseDatabaseService.createDevice({
        key: '',
        isActive: true,
        name: this.sensorForm.value.name,
        type: this.sensorForm.value.type,
        min: this.sensorForm.value.min,
        max: this.sensorForm.value.max,
        unit: this.sensorForm.value.unit,
        isActor: this.sensorForm.value.isActor,
      });
      this.saveBtn = false;
      this.showToast('Device created.', 'SUCCESS', NbToastStatus.SUCCESS);
      this.router.navigateByUrl('/sensors/list');
    } catch (e) {
      this.saveBtn = true;
      this.showToast('Device not created. Try again.', 'WARNING', NbToastStatus.DANGER);
    }
  }

  async updateDevice() {
    try {
      const newDevice = await this.firebaseDatabaseService.updateDevice(this.sensorKey, {
        key: this.sensorKey,
        isActive: true,
        name: this.sensorForm.value.name,
        type: this.sensorForm.value.type,
        min: this.sensorForm.value.min,
        max: this.sensorForm.value.max,
        unit: this.sensorForm.value.unit,
        isActor: this.sensorForm.value.isActor,
      });
      this.showToast('Device updated.', 'SUCCESS', NbToastStatus.SUCCESS);
      this.router.navigateByUrl('/sensors/list');
    } catch (e) {
      this.showToast('Device not updated. Try again.', 'WARNING', NbToastStatus.DANGER);
    }
  }

  onSubmit() {
    if (!this.editMode && this.sensorForm.valid) {
      this.createDevice();
    }
    if (this.editMode && this.sensorForm.valid) {
      this.updateDevice();
    }
  }
}
