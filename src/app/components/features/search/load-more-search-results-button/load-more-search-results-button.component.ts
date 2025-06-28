import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchService } from '../../../../services/search/search.service';

@Component({
    selector: 'app-load-more-search-results-button',
    imports: [NgIf, TranslatePipe],
    templateUrl: './load-more-search-results-button.component.html',
    styleUrl: './load-more-search-results-button.component.css'
})
export class LoadMoreSearchResultsButtonComponent {
  constructor(public search: SearchService) {}

  loadMore() {
    if (!this.search.isLoading.value) {
      void this.search.execute(false, false);
    }
  }
}
