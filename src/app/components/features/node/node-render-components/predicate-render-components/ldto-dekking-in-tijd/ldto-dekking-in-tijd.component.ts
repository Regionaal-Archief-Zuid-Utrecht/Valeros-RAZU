import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HopLinkComponent } from '../hop-components/hop-link/hop-link.component';

@Component({
  selector: 'app-ldto-dekking-in-tijd',
  standalone: true,
  imports: [HopLinkComponent, NgIf],
  templateUrl: './ldto-dekking-in-tijd.component.html',
  styleUrl: './ldto-dekking-in-tijd.component.scss',
})
export class LdtoDekkingInTijdComponent {
  hasBeginDate = false;
  hasEndDate = false;
  hasType = false;

  @Input() id?: string;
}
