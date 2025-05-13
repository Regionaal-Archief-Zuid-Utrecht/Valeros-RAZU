import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

interface LdtoEventData {
  id?: string;
}

@Component({
  selector: 'app-ldto-event',
  standalone: true,
  imports: [HopLinkComponent, NgClass],
  templateUrl: './ldto-event.component.html',
  styleUrl: './ldto-event.component.css',
})
export class LdtoEventComponent extends PredicateRenderComponent<LdtoEventData> {
  hasTime = false;
}
