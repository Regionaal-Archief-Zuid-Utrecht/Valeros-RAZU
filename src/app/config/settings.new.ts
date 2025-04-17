import { clusteringSettings } from './settings/clustering.settings';
import { endpointSettings } from './settings/endpoint.settings';
import { fileTypeSettings } from './settings/file-types.settings';
import { filteringSettings } from './settings/filtering.settings';
import { headerSettings } from './settings/header.settings';
import { matomoSettings } from './settings/matomo.settings';
import { miscSettings } from './settings/misc.settings';
import { predicateRenderSettings } from './settings/render.settings';
import { searchSettings } from './settings/search.settings';
import { sortingSettings } from './settings/sorting.settings';

export const Settings = {
  endpoints: endpointSettings,
  filtering: filteringSettings,
  fileTypes: fileTypeSettings,
  header: headerSettings,
  sorting: sortingSettings,
  search: searchSettings,
  clustering: clusteringSettings,
  matomo: matomoSettings,
  predicateRender: predicateRenderSettings,
  ...miscSettings,
};
