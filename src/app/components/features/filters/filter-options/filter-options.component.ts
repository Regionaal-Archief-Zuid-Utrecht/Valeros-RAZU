import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../config/settings';
import { FilterType } from '../../../../models/filters/filter.model';
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
    DateRangeFilterComponent,
    EndpointsComponent,
    FilterCountComponent,
    NgClass,
    FormsModule,
    TranslatePipe,
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
    this.filters.toggleMultiple([...this.filters.enabled.value]);
    this.filters.searchTrigger.emit({ clearFilters: true });
  }
}
