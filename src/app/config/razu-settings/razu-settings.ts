import { SettingsModel } from '../../models/settings/settings.model';
import { razuClusteringSettings } from './razu-clustering.settings';
import { razuEndpointSettings } from './razu-endpoint.settings';
import { razuFileRenderingSettings } from './razu-file-rendering.settings';
import { razuFilteringSettings } from './razu-filtering.settings';
import { razuIIIFSettings } from './razu-iiif.settings';
import { razuMatomoSettings } from './razu-matomo.settings';
import { razuNamespacePrefixes } from './razu-namespace-prefixes.settings';
import { razuNodeVisibilitySettings } from './razu-node-visibility.settings';
import { razuPredicateVisibilitySettings } from './razu-predicate-visibility.settings';
import { razuPredicateSettings } from './razu-predicate.settings';
import { razuRenderComponentSettings } from './razu-render-component.settings';
import { razuSearchSettings } from './razu-search.settings';
import { razuSortingSettings } from './razu-sorting.settings';
import { razuThemeSettings } from './razu-theme.settings';
import { razuUiSettings } from './razu-ui.settings';
import { razuUrlSettings } from './razu-url.settings';
import { razuViewModeSettings } from './razu-view-mode.settings';

export const razuSettings: SettingsModel = {
  endpoints: razuEndpointSettings,
  predicateVisibility: razuPredicateVisibilitySettings,
  nodeVisibility: razuNodeVisibilitySettings,
  sorting: razuSortingSettings,
  filtering: razuFilteringSettings,
  clustering: razuClusteringSettings,
  renderComponents: razuRenderComponentSettings,
  viewModes: razuViewModeSettings,
  ui: razuUiSettings,
  search: razuSearchSettings,
  iiif: razuIIIFSettings,
  namespacePrefixes: razuNamespacePrefixes,
  fileRendering: razuFileRenderingSettings,
  predicates: razuPredicateSettings,
  url: razuUrlSettings,
  matomo: razuMatomoSettings,
  theme: razuThemeSettings,
};
