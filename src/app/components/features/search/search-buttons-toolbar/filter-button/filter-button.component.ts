import { NgIf } from '@angular/common';
import { Component, HostListener, type OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherFilter } from '@ng-icons/feather-icons';
import { FilterType } from '../../../../../models/filters/filter.model';
import { FilterService } from '../../../../../services/search/filter.service';

@Component({
  selector: '[app-filter-button]',
  imports: [NgIcon, NgIf],
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent implements OnInit {
  constructor(private filters: FilterService) {}

  ngOnInit() {}

  // TODO: Reduce calls if needed for performance reasons
  getNumberOfEnabledFilterOptions(): number {
    const filterIds = Object.keys(this.filters.options.value);
    return filterIds.reduce(
      (enabledFiltersCount, filterId) =>
        enabledFiltersCount +
        this.filters.getOptionEnabledFiltersCount(
          filterId,
          FilterType.FieldAndValue,
        ),
      0,
    );
  }

  @HostListener('click')
  onClick() {
    // TODO: Open filter panel/modal
    console.log('Filter button clicked');
  }

  protected readonly featherFilter = featherFilter;
}
