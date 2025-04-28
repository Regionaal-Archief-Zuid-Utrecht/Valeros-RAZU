import { SettingsModel } from '../models/settings/settings.model';
import { clusteringSettings } from './settings/clustering.settings';
import { endpointSettings } from './settings/endpoint.settings';
import { fileTypeSettings } from './settings/file-types.settings';
import { filteringSettings } from './settings/filtering.settings';
import { iiifSettings } from './settings/iiif.settings';
import { matomoSettings } from './settings/matomo.settings';
import { namespacePrefixes } from './settings/namespace-prefixes.settings';
import { nodeVisibilitySettings } from './settings/node-visibility.settings';
import { predicateVisibilitySettings } from './settings/predicate-visibility.settings';
import { predicateSettings } from './settings/predicate.settings';
import { renderComponentSettings } from './settings/render-component.settings';
import { searchSettings } from './settings/search.settings';
import { sortingSettings } from './settings/sorting.settings';
import { uiSettings } from './settings/ui.settings';
import { viewModeSettings } from './settings/view-mode.settings';

export const Settings: SettingsModel = {
  endpoints: endpointSettings,
  predicateVisibility: predicateVisibilitySettings,
  nodeVisibility: nodeVisibilitySettings, // E.g. hide all nodes of type "skos:Concept", or only show nodes with a certain type
  sorting: sortingSettings,
  filtering: filteringSettings,
  clustering: clusteringSettings,
  renderComponents: renderComponentSettings,
  viewModes: viewModeSettings, // E.g. How are things displayed in list view, grid view, etc.
  ui: uiSettings,
  search: searchSettings,
  iiif: iiifSettings,
  namespacePrefixes: namespacePrefixes,
  fileTypes: fileTypeSettings,
  predicates: predicateSettings, // E.g. what predicates are used for parents, labels, types, files, etc.
  matomo: matomoSettings,
};
