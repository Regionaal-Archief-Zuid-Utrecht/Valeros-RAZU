import { SearchSettings } from '../../models/settings/search-settings.model';
import { autocompleteSettings } from './autocomplete.settings';

export const searchSettings: SearchSettings = {
  resultsPerPagePerEndpoint: 10,
  elasticTopHitsMax: 100, // Mainly used for counting filter option hits (e.g. if there are more than 100 "public domain" values found for the "license" filter, show "100+"). Max 100 by default for elastic, tweak index.max_inner_result_window to go higher
  autocomplete: autocompleteSettings,
};
