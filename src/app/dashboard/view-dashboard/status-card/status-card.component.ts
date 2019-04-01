import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { StatusCardDialogComponent } from './status-card-dialog.component';

@Component({
  selector: 'app-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card class="status-card" (click)="changeState()" [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon">
          <i class="ion ion-power"></i>
        </div>
      </div>
      <div class="details">
        <div class="title">{{ title }}</div>
        <div class="status">{{ on ? 'ON' : 'OFF' }}</div>
      </div>
    </nb-card>
  `,
})
export class StatusCardComponent {

  @Input() title: string;
  @Input() type: string;
  @Input() iconClass: string;
  @Input() on = true;

  @Output()
  valueChange = new EventEmitter<boolean>();

  constructor(private dialogService: NbDialogService) {}

  changeState() {
    const dialogRef = this.dialogService.open(
      StatusCardDialogComponent,
      {
        context: {
          title: this.title,
          iconClass: this.iconClass,
          value: !this.on,
        },
      },
    );
    dialogRef.onClose.subscribe(newValue => newValue !== null && this.valueChange.next(newValue));
  }
}
