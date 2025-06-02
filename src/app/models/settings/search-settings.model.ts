import { AutocompleteSettings } from './autocomplete-settings.model';

export interface SearchSettings {
  resultsPerPagePerEndpoint: number;
  /**
   * Mainly used for counting filter option hits (e.g. if there are more than 100 "public domain" values found for the "license" filter, show "100+").
   * Max by default is 100 for elastic, tweak index.max_inner_result_window to go higher
   */
  elasticTopHitsMax: number;
  autocomplete: AutocompleteSettings;
}
