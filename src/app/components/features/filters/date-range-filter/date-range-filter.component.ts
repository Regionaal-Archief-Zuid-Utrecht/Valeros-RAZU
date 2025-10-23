import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FilterModel,
  FilterType,
} from '../../../../models/filters/filter.model';
import { ElasticService } from '../../../../services/search/elastic.service';
import { FilterService } from '../../../../services/search/filter.service';
import { SearchService } from '../../../../services/search/search.service';
import { UrlService } from '../../../../services/url.service';

@Component({
  selector: 'app-date-range-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-range-filter.component.html',
  styleUrls: ['./date-range-filter.component.scss'],
})
export class DateRangeFilterComponent {
  @Input() filterId!: string;
  @Input() fieldId!: string;

  from?: string;
  to?: string;
  frombase?: string;
  tobase?: string;

  constructor(
    public filters: FilterService,
    private elastic: ElasticService,
    private search: SearchService,
    private url: UrlService,
  ) {}

  async ngOnInit() {
    const existing = this.getExisting();
    if (existing) {
      this.from = existing.from;
      this.to = existing.to;
      return;
    }

    // Compute min/max for current query and filters (excluding this date-range itself if present)
    const query = this.search.queryStr ?? '';
    const otherFilters: FilterModel[] = this.filters.enabled.value.filter(
      (f) =>
        !(
          f.type === FilterType.DateRange &&
          f.filterId === this.filterId &&
          f.fieldId === this.fieldId
        ),
    );
    try {
      const { min, max } = await this.elastic.getKeywordDateMinMax(
        this.fieldId,
        query,
        otherFilters,
      );
      if (!this.from && min) this.from = min;
      if (!this.to && max) this.to = max;
      if (!this.frombase && min) this.frombase = min;
      if (!this.tobase && max) this.tobase = max;
    } catch (e) {
      // ignore errors; leave inputs empty
    }
  }

  getExisting(): FilterModel | undefined {
    return this.filters.enabled.value.find(
      (f) =>
        f.type === FilterType.DateRange &&
        f.filterId === this.filterId &&
        f.fieldId === this.fieldId,
    );
  }

  apply() {
    this.filters.setDateRange(this.filterId, this.fieldId, this.from, this.to);
    // Immediately reflect in URL to avoid timing issues with async subscribers
    void this.url.updateUrlToReflectFilters(this.filters.enabled.value);
  }

  clear() {
    this.filters.setDateRange(
      this.filterId,
      this.fieldId,
      this.frombase,
      this.tobase,
    );
    this.from = this.frombase;
    this.to = this.tobase;
  }
}
