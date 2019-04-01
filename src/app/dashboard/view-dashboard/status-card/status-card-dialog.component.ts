import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-status-card-dialog',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card accent="warning">
      <nb-card-body>
        <span class="desc-dialog">
          Deseja <b>{{ value ? 'ligar' : 'desligar' }}</b> o dispositivo <b>{{ title }}</b>?
        </span>
        <div class="pass-input">
          <label style="color: #a4abb3;">Password</label>
          <input nbInput type="password" placeholder="Enter your password" fullWidth>
        </div>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton (click)="dialogRef.close(null)" status="warning">Cancelar</button>
        <button nbButton (click)="dialogRef.close(value)" status="warning">
          Sim, {{ value ? 'ligar' : 'desligar' }}.
        </button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class StatusCardDialogComponent {
  @Input() value: boolean;
  @Input() title: string;
  @Input() iconClass: string;

  constructor(public dialogRef: NbDialogRef<StatusCardDialogComponent>) {}
}
