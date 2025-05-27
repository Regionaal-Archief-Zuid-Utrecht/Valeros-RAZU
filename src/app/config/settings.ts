import { SettingsModel } from '../models/settings/settings.model';
import { clusteringSettings } from './default-settings/clustering.settings';
import { endpointSettings } from './default-settings/endpoint.settings';
import { fileRenderingSettings } from './default-settings/file-rendering.settings';
import { filteringSettings } from './default-settings/filtering.settings';
import { iiifSettings } from './default-settings/iiif.settings';
import { matomoSettings } from './default-settings/matomo.settings';
import { namespacePrefixes } from './default-settings/namespace-prefixes.settings';
import { nodeVisibilitySettings } from './default-settings/node-visibility.settings';
import { predicateVisibilitySettings } from './default-settings/predicate-visibility.settings';
import { predicateSettings } from './default-settings/predicate.settings';
import { renderComponentSettings } from './default-settings/render-component.settings';
import { searchSettings } from './default-settings/search.settings';
import { sortingSettings } from './default-settings/sorting.settings';
import { uiSettings } from './default-settings/ui.settings';
import { urlSettings } from './default-settings/url.settings';
import { viewModeSettings } from './default-settings/view-mode.settings';
import { razuSettings } from './razu-settings/razu-settings';

const defaultSettings: SettingsModel = {
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

export const Settings: SettingsModel = razuSettings;
