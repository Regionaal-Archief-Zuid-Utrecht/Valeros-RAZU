import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HopLinkComponent } from '../hop-components/hop-link/hop-link.component';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-mdto-event',
  standalone: true,
  imports: [HopLinkComponent, NgClass],
  templateUrl: './mdto-event.component.html',
  styleUrl: './mdto-event.component.css',
})
export class MdtoEventComponent {
  hasTime = false;

  @Input() id?: string;
}
