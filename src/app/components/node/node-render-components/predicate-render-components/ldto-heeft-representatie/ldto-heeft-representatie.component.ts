import { Component, type OnInit } from '@angular/core';
import { HopComponent } from '../hop-components/hop.component';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { LdtoUrlBestandComponent } from '../ldto-url-bestand/ldto-url-bestand.component';
import { NodeLinkComponent } from '../../../node-link/node-link.component';

@Component({
  selector: 'app-ldto-heeft-representatie',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    JsonPipe,
    LdtoUrlBestandComponent,
    NodeLinkComponent,
  ],
  templateUrl: './ldto-heeft-representatie.component.html',
  styleUrl: './ldto-heeft-representatie.component.css',
})
export class LdtoHeeftRepresentatieComponent extends HopComponent {}
