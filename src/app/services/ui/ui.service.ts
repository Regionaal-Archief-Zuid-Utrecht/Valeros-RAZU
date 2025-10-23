import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  accordionExpandedStates: { [id: string]: boolean } = {};
  filterDrawerExpanded = true;

  constructor() {}

  collapseAllAccordions() {
    for (const id of Object.keys(this.accordionExpandedStates)) {
      this.accordionExpandedStates[id] = false;
    }
  }
}
