import { UiSettings } from '../../models/settings/ui-settings.model';

export const uiSettings: UiSettings = {
  showLanguageToggle: false,
  labelMaxChars: 100,
  sectionNextToTableWidth: { search: '30%', details: '40%' },
  imageForWhenLoadingFails: '/assets/img/image-load-fail.png',
  header: {
    showLogo: true,
    showTitle: false,
    showButton: false,
    logoPath: '/assets/img/logo.svg',
    titleType: 'short' as const, // Options: 'short', 'regular'
    scale: 'small' as const, // Options: 'small', 'medium', 'large'
    gapBeforeContent: 'small' as const, // Options: 'small', 'medium', 'large'
    horizontalPosition: 'left' as const, // Options: stick-to-left, left, center, right, stick-to-right
    verticalPosition: 'top' as const, // Options: top, middle, bottom, middle only works if horizontalPosition is stick-to-left or stick-to-right
  },
};
