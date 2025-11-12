import {
  PredicateVisibility,
  PredicateVisibilitySettings,
} from '../../../models/settings/predicate-visibility-settings.model';
import { ViewMode } from '../../../models/view-mode.enum';
import { predicateVisibilitySettings } from '../../default-settings/settings/predicate-visibility.settings';

export const triplyPredicateVisibilitySettings: PredicateVisibilitySettings = {
  ...predicateVisibilitySettings,
  byViewMode: {
    [ViewMode.List]: {
      [PredicateVisibility.Show]: [
        {
          predicates: [
            'https://triplydb.com/academy/pokemon/vocab/description',
            'https://triplydb.com/academy/pokemon/vocab/name',
            'https://triplydb.com/academy/pokemon/vocab/type',
            'https://triplydb.com/academy/pokemon/vocab/species',
          ],
        },
      ],
      [PredicateVisibility.Details]: [
        {
          predicates: ['*'],
        },
      ],
      [PredicateVisibility.Hide]: [],
    },
    [ViewMode.Grid]: {
      ...predicateVisibilitySettings.byViewMode[ViewMode.Grid],
    },
  },
};
