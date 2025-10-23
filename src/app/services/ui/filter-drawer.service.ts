import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreakpointService } from '../breakpoint.service';

@Injectable({
  providedIn: 'root',
})
export class FilterDrawerService implements OnDestroy {
  // Desktop drawer state (keeps being shown or hidden)
  desktopExpanded = true;

  // Mobile drawer state (overlay drawer controlled by checkbox)
  mobileIsOpen = false;

  private breakpointSubscription?: Subscription;

  constructor(private breakpoint: BreakpointService) {
    this.initBreakpointSync();
  }

  ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  private initBreakpointSync() {
    this.breakpointSubscription = this.breakpoint.breakpoint$.subscribe(() => {
      if (this.breakpoint.isBreakpointOrLarger('lg')) {
        this.closeFilterDrawerMobile();
      }
    });
  }

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

  isOpen(): boolean {
    if (this.breakpoint.isBreakpointOrLarger('lg')) {
      return this.desktopExpanded;
    } else {
      return this.mobileIsOpen;
    }
  }

  updateFromCheckbox(checked: boolean) {
    this.mobileIsOpen = checked;
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
