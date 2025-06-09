import { HeaderPosition } from '../../../models/settings/header-settings.model';
import { UiSettings } from '../../../models/settings/ui-settings.model';
import { uiSettings } from '../../default-settings/settings/ui.settings';

export const razuUiSettings: UiSettings = {
  ...uiSettings,
  header: {
    ...uiSettings.header,
    showLogo: false,
    showTitle: true,
    showColofonButton: true,
    logoPath: '/assets/img/logo.svg',
    position: HeaderPosition.Center,
  },
};
