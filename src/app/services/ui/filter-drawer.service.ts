import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterDrawerService {
  // Desktop drawer state (keeps being shown or hidden)
  desktopExpanded = true;

  // Mobile drawer state (overlay drawer controlled by checkbox)
  mobileIsOpen = false;

  constructor() {}

  toggleFilterDrawerDesktop() {
    this.desktopExpanded = !this.desktopExpanded;
  }

  toggleFilterDrawerMobile() {
    this._setFilterDrawerMobileState(!this.mobileIsOpen);
  }

  closeFilterDrawerMobile() {
    this._setFilterDrawerMobileState(false);
  }

  openFilterDrawerMobile() {
    this._setFilterDrawerMobileState(true);
  }

  private _setFilterDrawerMobileState(isOpen: boolean) {
    this.mobileIsOpen = isOpen;
    const checkbox = document.getElementById(
      'filter-drawer-checkbox',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = isOpen;
    }
  }
}
