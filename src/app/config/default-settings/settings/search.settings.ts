import { SearchSettings } from '../../../models/settings/search-settings.model';
import { autocompleteSettings } from './autocomplete.settings';

export const searchSettings: SearchSettings = {
  elasticFilterTopHitsMax: 100,
  resultsPerPagePerEndpoint: 25,
  elasticTopHitsMax: 100,
  autocomplete: autocompleteSettings,
  preventReplacingPeriodWithSpaceForElasticSuffixes: ['.keyword'],
};
