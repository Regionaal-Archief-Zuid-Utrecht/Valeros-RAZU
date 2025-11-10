import { Directive, inject, Input, OnInit } from '@angular/core';
import { CustomFilterService } from '../../../../services/search/custom-filters/custom-filter.service';

@Directive()
export abstract class CustomFilterComponent implements OnInit {
  @Input() filterId?: string;
  @Input() fieldIds?: string[];

  customFilterService = inject(CustomFilterService);

  constructor() {}

  ngOnInit() {
    this._registerFilter();
  }

  private _registerFilter() {
    if (!this.filterId) {
      console.warn('No filterId provided for custom filter');
      return;
    }
    this.customFilterService.register(this.filterId);
  }
}
