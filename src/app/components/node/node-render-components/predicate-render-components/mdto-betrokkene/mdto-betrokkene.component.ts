import { Component, Input } from '@angular/core';
import { HopLinkComponent } from '../hop-components/hop-link/hop-link.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-mdto-betrokkene',
  standalone: true,
  imports: [HopLinkComponent, NgIf],
  templateUrl: './mdto-betrokkene.component.html',
  styleUrl: './mdto-betrokkene.component.scss',
})
export class MdtoDekkingInTijdComponent {
  hasActor = false;
  hasType = false;

  @Input() id?: string;
}
