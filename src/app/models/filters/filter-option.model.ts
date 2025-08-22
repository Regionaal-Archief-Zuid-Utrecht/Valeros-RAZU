import { ElasticSortOrder } from '../elastic/elastic-sort.model';
import { FilterType } from './filter.model';

export interface FilterOptionsIdsModel {
  [filterId: string]: FilterOptionIdsModel;
}

export interface FilterOptionIdsModel {
  type: FilterType;
  fieldIds: string[];
  valueIds: string[];
}

export interface FilterOptionsModel {
  [filterId: string]: FilterOptionModel;
}

export interface FilterOptionSortModel {
  type: '_count' | '_key';
  order: ElasticSortOrder;
}

export interface FilterOptionModel {
  label: string;
  fieldIds: string[];
  values: FilterOptionValueModel[];
  hideValueIds?: string[];
  showOnlyValueIds?: string[];
  showOnlyForSelectedFilters?: FilterOptionsIdsModel;
  sort?: FilterOptionSortModel;
}

export interface FilterOptionValueModel {
  ids: string[];
  label?: string;
  filterHitIds: string[];
  filterHitCount: number;
}
