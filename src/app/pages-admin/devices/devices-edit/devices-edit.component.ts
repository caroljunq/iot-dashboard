import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Device } from 'app/@core/iot-dash/iot-dash-models';
import { ToastService, NbToastStatus } from 'app/@theme/toast.service';

import { DevicesService } from './../devices.service';

@Component({
  selector: 'app-devices-edit',
  templateUrl: './devices-edit.component.html',
  styleUrls: ['./devices-edit.component.scss'],
})
export class DevicesEditComponent implements OnInit {
  sensorForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(6)]),
    type: new FormControl('', [Validators.required, Validators.minLength(3)]),
    unit: new FormControl('', [Validators.required, Validators.minLength(1)]),
    max: new FormControl('', [Validators.required,Validators.pattern(/^[+-]?(\d*\.)?\d+$/)]),
    min: new FormControl('', [Validators.required,Validators.pattern(/^[+-]?(\d*\.)?\d+$/)]),
    isActor: new FormControl(false, []),
    isActive: new FormControl(true, []),
  });

  editMode = false;
  sensorKey: string = '';
  sensorStatus: boolean = true;

  saveBtn = true;

  constructor(
    protected route: ActivatedRoute,
    protected devicesService: DevicesService,
    protected formBuilder: FormBuilder,
    protected toastService: ToastService,
    private router: Router,
  ) {
    this.saveBtn = true;

    this.route.paramMap.pipe(
      switchMap<ParamMap, Device>(paramMap => {
        const id = paramMap.get('id');
        if (id) {
          this.editMode = true;
          return this.devicesService.getDeviceById(id);
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
          name: sensor.name || '',
          type: sensor.type || '',
          unit: sensor.unit || '',
          max: sensor.max,
          min: sensor.min,
          isActor: sensor.isActor || false,
          isActive: sensor.isActive || false,
        });
      },
    );
  }

  ngOnInit() { }

  async createDevice() {
    try {
      const newDevice = await this.devicesService.createDevice({
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
      this.toastService.showToast('Device created.', 'SUCCESS', NbToastStatus.SUCCESS);
      this.router.navigateByUrl('/devices/list');
    } catch (e) {
      this.saveBtn = true;
      this.toastService.showToast('Device not created. Try again.', 'WARNING', NbToastStatus.DANGER);
    }
  }

  async updateDevice() {
    try {
      const newDevice = await this.devicesService.updateDevice(this.sensorKey, {
        key: this.sensorKey,
        isActive: true,
        name: this.sensorForm.value.name,
        type: this.sensorForm.value.type,
        min: this.sensorForm.value.min,
        max: this.sensorForm.value.max,
        unit: this.sensorForm.value.unit,
        isActor: this.sensorForm.value.isActor,
      });
      this.toastService.showToast('Device updated.', 'SUCCESS', NbToastStatus.SUCCESS);
      this.router.navigateByUrl('/sensors/list');
    } catch (e) {
      this.toastService.showToast('Device not updated. Try again.', 'WARNING', NbToastStatus.DANGER);
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
