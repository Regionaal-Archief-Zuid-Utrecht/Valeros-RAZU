import { UiSettings } from '../../models/settings/ui-settings.model';

export const uiSettings: UiSettings = {
  showLanguageToggle: false,
  labelMaxChars: 100,
  sectionNextToTableWidth: { search: '30%', details: '40%' },
  imageForWhenLoadingFails: '/assets/img/image-load-fail.png',
  showViewModeSelect: true, // Used to switch between list view, grid view, etc.
  minNumParentsToAllowTreeExpand: 3,
  objValues: {
    numToShowByDefault: 5,
    additionalNumToShowOnClick: 5,
  },
  filterOptions: {
    numToShowByDefault: 10,
    additionalNumToShowOnClick: 10,
  },
  labelFetchIntervalMs: 100, // There's a continuous loop in the cache service checking if there are new labels that need to be retrieved and cached
  header: {
    showLogo: true,
    showTitle: true,
    showColofonButton: false,
    logoPath: '/assets/img/logo.svg',
    titleType: 'short', // Options: 'short', 'regular'
    scale: 'small', // Options: 'small', 'medium', 'large'
    gapBeforeContent: 'small', // Options: 'small', 'medium', 'large'
    horizontalPosition: 'center', // Options: stick-to-left, left, center, right, stick-to-right
    verticalPosition: 'top', // Options: top, middle, bottom, middle only works if horizontalPosition is stick-to-left or stick-to-right
  },
};
