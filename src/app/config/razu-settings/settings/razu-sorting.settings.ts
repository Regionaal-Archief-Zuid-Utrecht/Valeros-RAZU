import { SortOrder } from '../../../models/settings/sort-order.enum';
import { SortingSettings } from '../../../models/settings/sorting-settings.model';
import { sortingSettings } from '../../default-settings/settings/sorting.settings';

export const razuSortingSettings: SortingSettings = {
  ...sortingSettings,
  options: {
    ...sortingSettings.options,
    'title-a-z': {
      fields: ['naam.raw'],
      label: 'Titel (A-Z)',
      order: SortOrder.Ascending,
    },
    'title-z-a': {
      fields: ['naam.raw'],
      label: 'Titel (Z-A)',
      order: SortOrder.Descending,
    },
  },
};
