import daisyuiBase from 'daisyui/src/theming/themes';
import { ThemeSettings } from '../../models/settings/theme-settings.model';

// See https://daisyui.com/theme-generator
export const themeSettings: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#4a4a4a',
  neutral: '#808080',
  accent: '#b3b3b3',
  secondary: '#6d6d6d',
  background: '#f2f2f2',
  search_background: '#f2f2f2',
  '--rounded-box': '1rem',
  '--rounded-btn': '1rem',
  '--rounded-badge': '1rem',
  'primary-content': 'white',
};
