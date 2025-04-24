import { ViewMode } from '../view-mode.enum';

export interface PredicateSection {
  label?: string;
  predicates: string[];
}

export type PredicateVisibilitySettings = {
  [v in ViewMode]: PredicateVisibilityEntries;
};

export enum PredicateVisibility {
  Show,
  Details,
  Hide,
}

export type PredicateVisibilityEntries = {
  [v in PredicateVisibility]: PredicateSection[];
};
