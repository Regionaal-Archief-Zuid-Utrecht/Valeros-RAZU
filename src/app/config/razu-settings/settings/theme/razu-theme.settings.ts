import { ThemeSettings } from '../../../../models/settings/theme-settings.model';
import { themeSettings } from '../../../default-settings/theme.settings';

// Default settings for development, replaced (see angular.json) for different environments (test, acceptance, production)
export const razuThemeSettings: ThemeSettings = {
  ...themeSettings,
};
