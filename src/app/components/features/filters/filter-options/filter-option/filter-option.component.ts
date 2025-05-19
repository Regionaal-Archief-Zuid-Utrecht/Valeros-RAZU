import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../../config/settings';
import { formatNumber } from '../../../../../helpers/util.helper';
import { FilterOptionValueModel } from '../../../../../models/filters/filter-option.model';
import {
  FilterModel,
  FilterType,
} from '../../../../../models/filters/filter.model';
import { FilterService } from '../../../../../services/search/filter.service';
import { SearchService } from '../../../../../services/search/search.service';
import { NodeLinkComponent } from '../../../node/node-link/node-link.component';

@Component({
  selector: 'app-filter-option',
  standalone: true,
  imports: [NgForOf, NodeLinkComponent, JsonPipe, NgIf, NgClass, TranslatePipe],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.scss',
})
export class FilterOptionComponent implements OnInit {
  @Input() filterId?: string;
  @Input() fieldIds?: string[];
  @Input() values?: FilterOptionValueModel[];

  numShowing = Settings.ui.filterOptions.numToShowByDefault;

  constructor(
    public filterService: FilterService,
    public search: SearchService,
  ) {}

  ngOnInit() {
    this.initResetNumShowingOnSearchResultsUpdate();
  }

  initResetNumShowingOnSearchResultsUpdate() {
    this.search.results.subscribe(() => {
      this.numShowing = Settings.ui.filterOptions.numToShowByDefault;
    });
  }

  onFilterToggle(valueIds: string[]) {
    if (!valueIds || !this.fieldIds) {
      return;
    }

    const filters: FilterModel[] = this.fieldIds.flatMap((fieldId) => {
      return valueIds.map((valueId) => {
        return {
          filterId: this.filterId,
          fieldId: fieldId,
          valueId: valueId,
          type: FilterType.FieldAndValue,
        };
      });
    });

    this.filterService.toggleMultiple(filters);
  }

  getFilterOptionCountStr(count: number): string {
    if (count >= Settings.search.elasticTopHitsMax) {
      return ` (${Settings.search.elasticTopHitsMax}+)`;
    }

    return ` (${count})`;
  }

  get hasMoreToShow(): boolean {
    if (!this.values) {
      return false;
    }
    return this.numShowing < this.values.length;
  }

  onShowMoreClicked() {
    this.numShowing += Settings.ui.filterOptions.additionalNumToShowOnClick;
  }

  protected readonly FilterType = FilterType;
  protected readonly formatNumber = formatNumber;
}
