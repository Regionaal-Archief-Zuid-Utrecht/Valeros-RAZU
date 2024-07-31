import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { NgClass, NgIf, CommonModule } from '@angular/common';
import { SearchService } from '../../services/search/search.service';
import { Settings } from '../../config/settings';
import { featherSearch } from '@ng-icons/feather-icons';
import { NavigationExtras, Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf, NgClass, CommonModule, TranslocoModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  searchInput: string = this.search.queryStr;

  constructor(
    public search: SearchService,
    public router: Router,
  ) {}

  ngOnInit() {}

  protected readonly Settings = Settings;
  protected readonly featherSearch = featherSearch;

  onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    const queryParams: NavigationExtras = {
      queryParams: { q: this.searchInput },
    };

    void this.router.navigate(['search'], queryParams);
  }
}
