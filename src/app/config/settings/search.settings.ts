import { SearchSettings } from '../../models/settings/search-settings.model';
import { autocompleteSettings } from './autocomplete.settings';

export const searchSettings: SearchSettings = {
  resultsPerPagePerEndpoint: 10,
  maxFilterOptionValuesCount: 500,
  autocomplete: autocompleteSettings,
};
