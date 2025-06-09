import daisyuiBase from 'daisyui/src/theming/themes';
import { ThemeSettings } from '../models/settings/theme-settings.model';

export const developmentTheme: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#0082c2',
  neutral: '#0082c2',
  accent: '#b3b3b3',
  secondary: '#6d6d6d',
  background: '#f2f2f2',
  search_background: '#f2f2f2',
  '--rounded-box': '1rem',
  '--rounded-btn': '1rem',
  '--rounded-badge': '1rem',
  'primary-content': 'white',
};

export const acceptanceTheme: ThemeSettings = {
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

export const productionTheme: ThemeSettings = {
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

export const testTheme: ThemeSettings = {
  ...daisyuiBase['light'],
  primary: '#1565c0',
  neutral: '#42a5f5',
  accent: '#90caf9',
  secondary: '#1976d2',
  background: '#e3f2fd',
  search_background: '#e3f2fd',
  '--rounded-box': '0.375rem',
  '--rounded-btn': '0.375rem',
  '--rounded-badge': '0.375rem',
  'primary-content': 'white',
};
