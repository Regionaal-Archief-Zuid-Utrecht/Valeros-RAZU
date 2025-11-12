import { SettingsModel } from '../../models/settings/settings.model';
import { defaultSettings } from '../default-settings/default-settings';
import { triplyEndpointSettings } from './settings/triply-endpoint.settings';
import { triplyFilteringSettings } from './settings/triply-filtering.settings';

export const triplySettings: SettingsModel = {
  ...defaultSettings,
  endpoints: triplyEndpointSettings,
  filtering: triplyFilteringSettings,
};
