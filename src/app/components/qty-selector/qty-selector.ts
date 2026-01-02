import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-qty-selector',
  imports: [MatIcon, MatIconButton],
  template: `
    <div class="flex items-center gap-3">
      <div class="inline-flex items-center">
        <button matIconButton [disabled]="quantity() === 1" (click)="quantityUpdated.emit(quantity()-1)">
          <mat-icon>remove</mat-icon>
        </button>
        <label>{{quantity()}}</label>
        <button matIconButton (click)="quantityUpdated.emit(quantity()+1)">
          <mat-icon>add</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class QtySelector {
  quantity = input<number>(0);
  quantityUpdated = output<number>();
}
