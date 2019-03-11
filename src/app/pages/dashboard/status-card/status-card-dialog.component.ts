import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-status-card-dialog',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card accent="warning">
      <nb-card-body>
        <nb-card class="status-card dialog">
          <span class="desc-dialog">
            Deseja <b>{{ value ? 'ligar' : 'desligar' }}</b> o dispositivo <b>{{ title }}</b>?
          </span>
        </nb-card>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton (click)="dialogRef.close(null)">Cancelar</button>
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

  constructor(protected dialogRef: NbDialogRef<StatusCardDialogComponent>) {}
}
