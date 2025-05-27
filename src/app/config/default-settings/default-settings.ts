import { SettingsModel } from '../../models/settings/settings.model';
import { clusteringSettings } from './clustering.settings';
import { endpointSettings } from './endpoint.settings';
import { fileRenderingSettings } from './file-rendering.settings';
import { filteringSettings } from './filtering.settings';
import { iiifSettings } from './iiif.settings';
import { matomoSettings } from './matomo.settings';
import { namespacePrefixes } from './namespace-prefixes.settings';
import { nodeVisibilitySettings } from './node-visibility.settings';
import { predicateVisibilitySettings } from './predicate-visibility.settings';
import { predicateSettings } from './predicate.settings';
import { renderComponentSettings } from './render-component.settings';
import { searchSettings } from './search.settings';
import { sortingSettings } from './sorting.settings';
import { uiSettings } from './ui.settings';
import { urlSettings } from './url.settings';
import { viewModeSettings } from './view-mode.settings';

export const defaultSettings: SettingsModel = {
  endpoints: endpointSettings,
  predicateVisibility: predicateVisibilitySettings,
  nodeVisibility: nodeVisibilitySettings,
  sorting: sortingSettings,
  filtering: filteringSettings,
  clustering: clusteringSettings,
  renderComponents: renderComponentSettings,
  viewModes: viewModeSettings,
  ui: uiSettings,
  search: searchSettings,
  iiif: iiifSettings,
  namespacePrefixes: namespacePrefixes,
  fileRendering: fileRenderingSettings,
  predicates: predicateSettings,
  url: urlSettings,
  matomo: matomoSettings,
};
