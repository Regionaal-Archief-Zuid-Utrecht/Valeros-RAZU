import { SortOrder } from '../../../models/settings/sort-order.enum';
import { SortingSettings } from '../../../models/settings/sorting-settings.model';
import { sortingSettings } from '../../default-settings/settings/sorting.settings';
import { razuLabelPredicates } from './razu-predicate.settings';

export const razuSortingSettings: SortingSettings = {
  ...sortingSettings,
  options: {
    ...sortingSettings.options,
    'title-a-z': {
      fields: razuLabelPredicates.map((pred) => pred + '.keyword'),
      label: 'Titel (A-Z)',
      order: SortOrder.Ascending,
    },
    'title-z-a': {
      fields: razuLabelPredicates.map((pred) => pred + '.keyword'),
      label: 'Titel (Z-A)',
      order: SortOrder.Descending,
    },
  },
};
