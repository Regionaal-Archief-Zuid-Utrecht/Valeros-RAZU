import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HopLinkComponent } from '../hop-components/hop-link/hop-link.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-ldto-event',
  standalone: true,
  imports: [HopLinkComponent, NgClass],
  templateUrl: './ldto-event.component.html',
  styleUrl: './ldto-event.component.css',
})
export class LdtoEventComponent {
  hasTime = false;

  @Input() id?: string;
}
