import daisyuiBase from 'daisyui/src/theming/themes';
import { ThemeSettings } from '../../../../models/settings/theme-settings.model';

export const razuThemeSettings: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#2e7d32',
  neutral: '#66bb6a',
  accent: '#a5d6a7',
  secondary: '#388e3c',
  background: '#e8f5e9',
  search_background: '#e8f5e9',
  '--rounded-box': '1rem',
  '--rounded-btn': '1rem',
  '--rounded-badge': '1rem',
  'primary-content': 'white',
};
