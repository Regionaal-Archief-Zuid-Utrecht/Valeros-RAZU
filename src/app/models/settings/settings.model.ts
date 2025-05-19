import { FileType } from '../file-type.model';
import { ClusteringSettings } from './clustering-settings.model';
import { EndpointSettings } from './endpoint-settings.model';
import { FileTypeConfig } from './file-type-config.model';
import { FilteringSettings } from './filtering-settings.model';
import { IIIFSettings } from './iiif-settings.model';
import { MatomoSettings } from './matomo-settings.model';
import { NodeVisibilitySettings } from './node-visibility-settings.model';
import { PredicateSettings } from './predicate-settings.model';
import { PredicateVisibilitySettings } from './predicate-visibility-settings.model';
import { RenderComponentsSettings } from './render-component-settings.type';
import { SearchSettings } from './search-settings.model';
import { SortingSettings } from './sorting-settings.model';
import { UiSettings } from './ui-settings.model';
import { UrlSettings } from './url-settings.model';
import { ViewModeSettings } from './view-mode-settings.type';

export interface SettingsModel {
  endpoints: EndpointSettings;
  predicateVisibility: PredicateVisibilitySettings;
  nodeVisibility: NodeVisibilitySettings;
  sorting: SortingSettings;
  filtering: FilteringSettings;
  clustering: ClusteringSettings;
  renderComponents: RenderComponentsSettings;
  viewModes: ViewModeSettings;
  ui: UiSettings;
  search: SearchSettings;
  iiif: IIIFSettings;
  namespacePrefixes: Record<string, string>;
  fileTypes: Record<FileType, FileTypeConfig>;
  predicates: PredicateSettings;
  url: UrlSettings;
  matomo?: MatomoSettings;
}
