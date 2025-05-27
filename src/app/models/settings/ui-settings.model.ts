import { HeaderSettings } from '../header/header-position.types';

export interface UiSettings {
  showLanguageToggle: boolean;
  labelMaxChars: number;
  sectionNextToTableWidth: { search: string; details: string };
  imageForWhenLoadingFails: string;
  /** Used to switch between list view, grid view, etc. */
  showViewModeSelect: boolean;
  header: HeaderSettings;
  /**
   * Minimum number of parents a node should have to allow tree expansion.
   * This is to prevent the tree from becoming too large and taking up too much space.
   */
  minNumParentsToAllowTreeExpand: number;
  objValues: {
    numToShowByDefault: number;
    additionalNumToShowOnClick: number;
  };
  filterOptions: {
    numToShowByDefault: number;
    additionalNumToShowOnClick: number;
  };
  /**
   * There's a continuous loop in the cache service checking if there are new labels that need to be retrieved and cached.
   * We do this to batch requests to the server, reducing the total number of requests made and avoiding rate limits.
   * This setting controls the interval between checks.
   */
  labelFetchIntervalMs: number;
}
