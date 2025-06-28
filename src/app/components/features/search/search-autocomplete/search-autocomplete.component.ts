import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherArrowRight, featherSearch } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../../../../models/autocomplete-option.model';
import { AutocompleteService } from '../../../../services/search/autocomplete.service';

@Component({
    selector: 'app-search-autocomplete',
    imports: [NgForOf, NgIf, NgIcon, TranslatePipe],
    templateUrl: './search-autocomplete.component.html',
    styleUrl: './search-autocomplete.component.css'
})
export class SearchAutocompleteComponent {
  @Output() selected: EventEmitter<AutocompleteOptionModel> =
    new EventEmitter<AutocompleteOptionModel>();

  constructor(public autocomplete: AutocompleteService) {}

  protected readonly AutoCompleteOptionType = AutocompleteOptionType;
  protected readonly AutocompleteOptionType = AutocompleteOptionType;
  protected readonly featherSearch = featherSearch;
  protected readonly featherArrowRight = featherArrowRight;
}
