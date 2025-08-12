import { SearchSettings } from '../../../models/settings/search-settings.model';
import { autocompleteSettings } from './autocomplete.settings';

export const searchSettings: SearchSettings = {
  resultsPerPagePerEndpoint: 10,
  elasticTopHitsMax: 10000,
  autocomplete: autocompleteSettings,
  preventReplacingPeriodWithSpaceForElasticSuffixes: ['.keyword'],
};
