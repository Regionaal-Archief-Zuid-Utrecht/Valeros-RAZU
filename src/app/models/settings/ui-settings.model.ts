import { HeaderSettings } from '../header/header-position.types';

export interface UiSettings {
  showLanguageToggle: boolean;
  labelMaxChars: number;
  sectionNextToTableWidth: { search: string; details: string };
  imageForWhenLoadingFails: string;
  showViewModeSelect: boolean;
  header: HeaderSettings;
  minNumParentsToAllowTreeExpand: number;
  objValues: {
    numToShowByDefault: number;
    additionalNumToShowOnClick: number;
  };
  filterOptions: {
    numToShowByDefault: number;
    additionalNumToShowOnClick: number;
  };
  labelFetchIntervalMs: number;
}
