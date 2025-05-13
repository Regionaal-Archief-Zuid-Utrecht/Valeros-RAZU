import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { HopLinkComponent } from '../../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

interface LdtoDekkingInTijdData {
  id?: string;
}

@Component({
  selector: 'app-ldto-dekking-in-tijd',
  standalone: true,
  imports: [HopLinkComponent, NgIf],
  templateUrl: './ldto-dekking-in-tijd.component.html',
  styleUrl: './ldto-dekking-in-tijd.component.scss',
})
export class LdtoDekkingInTijdComponent extends PredicateRenderComponent<LdtoDekkingInTijdData> {
  hasBeginDate = false;
  hasEndDate = false;
  hasType = false;
}
