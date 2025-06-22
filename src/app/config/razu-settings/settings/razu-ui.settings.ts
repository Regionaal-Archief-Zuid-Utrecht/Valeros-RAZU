import { AboutPosition } from '../../../models/settings/about-settings.model';
import { HeaderPosition } from '../../../models/settings/header-settings.model';
import { UiSettings } from '../../../models/settings/ui-settings.model';
import { uiSettings } from '../../default-settings/settings/ui.settings';

export const razuUiSettings: UiSettings = {
  ...uiSettings,
  header: {
    ...uiSettings.header,
    showLogo: true,
    showTitle: true,
    showColofonButton: false,
    logoPath: '/assets/img/hemiw_logo.png',
    position: HeaderPosition.Center,
  },
  about: {
    ...uiSettings.about,
    showLogo: false,
    showTitle: true,
    showColofonButton: false,
    logoPath: '/assets/img/logo.svg',
    position: AboutPosition.Right,
  },
};
