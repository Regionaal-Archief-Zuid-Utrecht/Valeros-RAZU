import { SettingsModel } from '../../models/settings/settings.model';
import { defaultSettings } from '../default-settings/default-settings';
import { triplyEndpointSettings } from './settings/triply-endpoint.settings';
import { triplyFilteringSettings } from './settings/triply-filtering.settings';
import { triplyNamespacePrefixes } from './settings/triply-namespace-prefixes.settings';
import { triplyPredicateVisibilitySettings } from './settings/triply-predicate-visibility.settings';
import { triplyRenderComponentSettings } from './settings/triply-render-component.settings';

export const triplySettings: SettingsModel = {
  ...defaultSettings,
  endpoints: triplyEndpointSettings,
  filtering: triplyFilteringSettings,
  namespacePrefixes: triplyNamespacePrefixes,
  renderComponents: triplyRenderComponentSettings,
  predicateVisibility: triplyPredicateVisibilitySettings,
};
