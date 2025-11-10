import { Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateRangeFilterService } from '../../../../../services/search/custom-filters/razu/date-range-filter.service';
import { FilterService } from '../../../../../services/search/filter.service';
import { CustomFilterComponent } from '../custom-filter.directive';

@Component({
  selector: 'app-date-range-filter',
  imports: [FormsModule],
  templateUrl: './date-range-filter.component.html',
  standalone: true,
})
export class DateRangeFilterComponent
  extends CustomFilterComponent
  implements OnInit
{
  earliestDate?: string;
  latestDate?: string;
  fromDate?: string;
  toDate?: string;

  constructor(
    public filters: FilterService,
    public dateRange: DateRangeFilterService,
  ) {
    super();
  }

  ngOnInit() {
    this.filters.enabled.subscribe(() => {
      this.initEarliestLatestDates();
    });
  }

  async initEarliestLatestDates() {
    try {
      // TODO: Support multiple date fields
      const dateField = this.fieldIds?.[0] ?? '';
      const { earliest, latest } =
        await this.dateRange.getEarliestLatestDates(dateField);
      this.earliestDate = earliest;
      this.latestDate = latest;
      this.fromDate = earliest;
      this.toDate = latest;

      // const fromDateIsEarlierThanEarliestDate =
      //   this.fromDate && this.earliestDate && this.fromDate < this.earliestDate;
      // if (!this.fromDate || fromDateIsEarlierThanEarliestDate) {
      //   this.fromDate = this.earliestDate;
      // }

      // const toDateIsLaterThanLatestDate =
      //   this.toDate && this.latestDate && this.toDate > this.latestDate;
      // if (!this.toDate || toDateIsLaterThanLatestDate) {
      //   this.toDate = this.latestDate;
      // }
    } catch (e) {
      console.error(e);
    }
  }

  // async ngOnInit() {
  //   const existing = this.getExisting();
  //   if (existing) {
  //     this.from = existing.from;
  //     this.to = existing.to;
  //     return;
  //   }

  //   // Compute min/max for current query and filters (excluding this date-range itself if present)
  //   const query = this.search.queryStr ?? '';
  //   const otherFilters: FilterModel[] = this.filters.enabled.value.filter(
  //     (f) =>
  //       !(
  //         f.type === FilterType.DateRange &&
  //         f.filterId === this.filterId &&
  //         f.fieldId === this.fieldId
  //       ),
  //   );
  //   try {
  //     const { min, max } = await this.elastic.getKeywordDateMinMax(
  //       this.fieldId,
  //       query,
  //       otherFilters,
  //     );
  //     if (!this.from && min) this.from = min;
  //     if (!this.to && max) this.to = max;
  //     if (!this.frombase && min) this.frombase = min;
  //     if (!this.tobase && max) this.tobase = max;
  //   } catch (e) {
  //     // ignore errors; leave inputs empty
  //   }
  // }

  // getExisting(): FilterModel | undefined {
  //   return this.filters.enabled.value.find(
  //     (f) =>
  //       f.type === FilterType.DateRange &&
  //       f.filterId === this.filterId &&
  //       f.fieldId === this.fieldId,
  //   );
  // }

  // apply() {
  //   this.filters.setDateRange(this.filterId, this.fieldId, this.from, this.to);
  //   // Immediately reflect in URL to avoid timing issues with async subscribers
  //   void this.url.updateUrlToReflectFilters(this.filters.enabled.value);
  // }

  clear() {
    this.fromDate = '';
    this.toDate = '';
  }
}
