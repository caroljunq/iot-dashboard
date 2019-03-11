import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-status-card-dialog',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card accent="warning">
      <nb-card-header>{{ value ? 'Ligar' : 'Desligar' }} {{ title }}</nb-card-header>
      <nb-card-body>
        <nb-card class="status-card dialog">
          <div class="icon-container">
            <div class="icon primary">
              <i [ngClass]="iconClass"></i>
            </div>
          </div>
          <p class="details">
            Para <b><i>{{ value ? 'ligar' : 'desligar' }}</i></b>
            <b>{{ title }}</b>
            é necessário confirmação.
          </p>
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
