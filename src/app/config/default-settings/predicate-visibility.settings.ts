import {
  PredicateVisibility,
  PredicateVisibilitySettings,
} from '../../models/settings/predicate-visibility-settings.model';
import { ViewMode } from '../../models/view-mode.enum';

export const predicateVisibilitySettings: PredicateVisibilitySettings = {
  byViewMode: {
    [ViewMode.List]: {
      [PredicateVisibility.Show]: [{ predicates: ['*'] }],
      [PredicateVisibility.Details]: [],
      [PredicateVisibility.Hide]: [],
    },
    [ViewMode.Grid]: {
      [PredicateVisibility.Show]: [],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
  },
  alwaysHide: ['@id', 'endpointId'],
  hideForTypes: [],
};
