import { Env } from '../env.type';

export interface Theme {
  primary: string;
  neutral: string;
  accent: string;
  secondary: string;
  background: string;
  search_background: string;
  'primary-content': string;
  '--rounded-box': string;
  '--rounded-btn': string;
  '--rounded-badge': string;
  [key: string]: string;
}

export type ThemeSettings = Record<Env, Theme>;
