import { AutocompleteSettings } from './autocomplete-settings.model';

export interface SearchSettings {
  resultsPerPagePerEndpoint: number;
  elasticTopHitsMax: number;
  autocomplete: AutocompleteSettings;
}
