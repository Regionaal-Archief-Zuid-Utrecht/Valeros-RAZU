import { Component, type OnInit } from '@angular/core';
import { HopComponent } from '../hop-components/hop.component';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { MdtoUrlBestandComponent } from '../mdto-url-bestand/mdto-url-bestand.component';
import { NodeLinkComponent } from "../../../node-link/node-link.component";

@Component({
  selector: 'app-mdto-heeft-representatie',
  standalone: true,
  imports: [NgIf, NgForOf, JsonPipe, MdtoUrlBestandComponent, NodeLinkComponent],
  templateUrl: './mdto-heeft-representatie.component.html',
  styleUrl: './mdto-heeft-representatie.component.css',
})
export class MdtoHeeftRepresentatieComponent extends HopComponent {}
