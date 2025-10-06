import { Component, HostListener, type OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherFilter } from '@ng-icons/feather-icons';
import { FilterService } from '../../../../../services/search/filter.service';

@Component({
  selector: '[app-filter-button]',
  imports: [NgIcon],
  templateUrl: './filter-button.component.html',
})
export class FilterButtonComponent implements OnInit {
  constructor(private filters: FilterService) {}

  ngOnInit() {}

  @HostListener('click')
  onClick() {
    // TODO: Open filter panel/modal
    console.log('Filter button clicked');
  }

  protected readonly featherFilter = featherFilter;
}
