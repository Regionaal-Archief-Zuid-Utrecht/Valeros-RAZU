import { AutocompleteSettings } from './autocomplete-settings.model';

export interface SearchSettings {
  resultsPerPagePerEndpoint: number;
  maxFilterOptionValuesCount: number;
  autocomplete: AutocompleteSettings;
}
