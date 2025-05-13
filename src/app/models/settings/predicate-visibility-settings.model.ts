import { ViewMode } from '../view-mode.enum';

export interface PredicateSection {
  label?: string;
  predicates: string[];
}

export type PredicateVisibilitySettingsByViewMode = {
  [v in ViewMode]: PredicateVisibilityEntries;
};

export interface PredicateVisibilitySettings {
  byViewMode: PredicateVisibilitySettingsByViewMode;
  alwaysHide: string[];
  hideForTypes: string[];
}

export enum PredicateVisibility {
  Show,
  Details,
  Hide,
}

export type PredicateVisibilityEntries = {
  [v in PredicateVisibility]: PredicateSection[];
};
