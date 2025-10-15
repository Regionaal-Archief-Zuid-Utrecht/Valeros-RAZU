import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../config/settings';
import { FilterType } from '../../../../models/filters/filter.model';
import { FilterOptionValueModel } from '../../../../models/filters/filter-option.model';
import { FilterService } from '../../../../services/search/filter.service';
import { SettingsService } from '../../../../services/settings.service';
import { UiService } from '../../../../services/ui/ui.service';
import { EndpointsComponent } from '../endpoints/endpoints.component';
import { FilterCountComponent } from './filter-count/filter-count.component';
import { FilterOptionComponent } from './filter-option/filter-option.component';
import { DateRangeFilterComponent } from '../date-range-filter/date-range-filter.component';

@Component({
  selector: 'app-filter-options',
  imports: [
    NgIf,
    NgForOf,
    FilterOptionComponent,
    EndpointsComponent,
    FilterCountComponent,
    NgClass,
    FormsModule,
    TranslatePipe,
    DateRangeFilterComponent,
  ],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss',
})
export class FilterOptionsComponent {
  constructor(
    public filters: FilterService,
    public settings: SettingsService,
    public ui: UiService,
  ) {}

  ngOnInit() {}

  protected readonly Object = Object;
  protected readonly FilterType = FilterType;
  protected readonly Settings = Settings;

  clearFilters(): void {
    // First toggle off all enabled filters
    this.filters.toggleMultiple([...this.filters.enabled.value]);
    // Then trigger a search
    this.filters.searchTrigger.emit({ clearFilters: true });
  }
  uix = {
    filterGroupExpanded: true, // Default to expanded
    accordionExpandedStates: {}, // Maintain individual filter states
  };

  // Extract YYYY-MM-DD strings from the current values for a given filterId.
  getDateStrings(filterId: string): string[] {
    const option = this.filters.getOptionById(filterId);
    const values: FilterOptionValueModel[] | undefined = option?.values;
    if (!values || values.length === 0) return [];
    // Values expose value ids via `ids`; for document day we expect one id per value like '1981-01-01'
    const out: string[] = [];
    for (const v of values) {
      if (Array.isArray(v.ids)) {
        for (const id of v.ids) {
          if (typeof id === 'string' && /^(\d{4})-(\d{2})-(\d{2})$/.test(id)) {
            out.push(id);
            break; // take the first matching id per value
          }
        }
      }
    }
    return out;
  }

  // Temporary: just log the emitted range (non-invasive test mount)
  onDateRangeChange(range: { from?: string; until?: string }) {
    // Apply the date range filter to document_day
    this.filters.setDateRangeFilter(range);
  }

  // Compute overall min/max domain from the documentYear filter if present
  getYearRange(): { min?: string; max?: string } {
    const yearOption = this.filters.getOptionById('documentYear');
    const values: FilterOptionValueModel[] | undefined = yearOption?.values;
    if (!values || values.length === 0) return {};
    const years: number[] = [];
    for (const v of values) {
      if (Array.isArray(v.ids)) {
        for (const id of v.ids) {
          const y = Number(id);
          if (Number.isFinite(y)) {
            years.push(y);
            break;
          }
        }
      }
    }
    if (years.length === 0) return {};
    years.sort((a, b) => a - b);
    const minY = years[0];
    const maxY = years[years.length - 1];
    // Use full-year coverage
    const min = `${String(minY).padStart(4, '0')}-01-01`;
    const max = `${String(maxY).padStart(4, '0')}-12-31`;
    return { min, max };
  }

  // Prefer bounds from FilterService (Elasticsearch min/max) with fallback to year range
  getDateDomain(): { min?: string; max?: string } {
    const bounds = this.filters.dateRangeBounds?.value ?? {};
    const hasBounds = !!bounds.min && !!bounds.max;
    if (hasBounds) return bounds;
    return this.getYearRange();
  }
}
