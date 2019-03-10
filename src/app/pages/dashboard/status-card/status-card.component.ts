import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card (click)="nextValue()" [ngClass]="{'off': !on}">
      <div class="icon-container">
        <div class="icon {{ type }}">
          <ng-content></ng-content>
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
  @Input() on = true;

  @Output()
  valueChange = new EventEmitter<boolean>();

  nextValue() {
    this.valueChange.next(!this.on);
  }
}
