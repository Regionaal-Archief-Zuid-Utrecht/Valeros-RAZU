import daisyuiBase from 'daisyui/src/theming/themes';
import { ThemeSettings } from '../../../../models/settings/theme-settings.model';

export const razuThemeSettings: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#6c5a82',
  neutral: '#a999bd',
  accent: '#9ad199',
  secondary: '#c2b280',
  background: '#E5E4E2',
  search_background: '#E5E4E2',
  '--rounded-box': '0.375rem',
  '--rounded-btn': '0.375rem',
  '--rounded-badge': '0.375rem',
  'primary-content': 'white',
};
