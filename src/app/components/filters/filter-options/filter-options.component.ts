import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import { FilterType } from '../../../models/filter.model';
import { FilterService } from '../../../services/search/filter.service';
import { SettingsService } from '../../../services/settings.service';
import { UiService } from '../../../services/ui.service';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { SortSelectComponent } from '../../sort-select/sort-select.component';
import { EndpointsComponent } from '../endpoints/endpoints.component';
import { ImageFilterComponent } from '../image-filter/image-filter.component';
import { FilterCountComponent } from './filter-count/filter-count.component';
import { FilterOptionComponent } from './filter-option/filter-option.component';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FilterOptionComponent,
    EndpointsComponent,
    FilterCountComponent,
    NgClass,
    FormsModule,
    ImageFilterComponent,
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
    // First toggle off all enabled filters
    this.filters.toggleMultiple([...this.filters.enabled.value]);
    // Then trigger a search
    this.filters.searchTrigger.emit({ clearFilters: true });
  }
  uix = {
    filterGroupExpanded: true, // Default to expanded
    accordionExpandedStates: {}, // Maintain individual filter states
  };
}
