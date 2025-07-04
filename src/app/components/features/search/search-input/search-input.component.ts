import { NgIf } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherAlertTriangle } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../../config/settings';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../../../../models/autocomplete-option.model';
import { DetailsService } from '../../../../services/details.service';
import { AutocompleteService } from '../../../../services/search/autocomplete.service';
import { ElasticService } from '../../../../services/search/elastic.service';
import { SearchService } from '../../../../services/search/search.service';
import { SettingsService } from '../../../../services/settings.service';
import { UrlService } from '../../../../services/url.service';
import { SearchAutocompleteComponent } from '../search-autocomplete/search-autocomplete.component';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    SearchAutocompleteComponent,
    TranslatePipe,
    NgIcon,
  ],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit, AfterViewInit {
  searchInput: string = this.search.queryStr ?? '';

  constructor(
    public search: SearchService,
    public router: Router,
    public elastic: ElasticService,
    public details: DetailsService,
    public autocomplete: AutocompleteService,
    public url: UrlService,
    public settings: SettingsService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  get hasAutocompleteOptions(): boolean {
    return this.autocomplete.options.value.length > 0;
  }

  async onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    this.autocomplete.clearOptions();
    this.autocomplete.searchSubject.next('');

    await this.router.navigate(['/search'], {
      queryParams: { [Settings.url.params.search]: this.searchInput },
      queryParamsHandling: 'merge',
    });
  }

  async onSearchInputChange() {
    if (!Settings.search.autocomplete.enabled) {
      return;
    }

    this.autocomplete.searchSubject.next(this.searchInput);
  }

  async onAutocompleteOptionSelect(option: AutocompleteOptionModel) {
    if (option.labels.length === 0) {
      console.warn('No label found for autocomplete option', option);
      return;
    }

    this.autocomplete.clearOptions();

    const isSearchOption = option.type === AutocompleteOptionType.SearchTerm;
    const isNodeOption = option.type === AutocompleteOptionType.Node;

    if (isSearchOption) {
      this.searchInput = option.labels[0];
      await this.onSearch();
    } else if (isNodeOption) {
      await this.router.navigateByUrl(
        this.details.getLinkFromUrl(option['@id']),
      );
    } else {
      console.warn('Unknown autocomplete option type');
    }
  }

  protected readonly Settings = Settings;
  protected readonly featherAlertTriangle = featherAlertTriangle;
}
