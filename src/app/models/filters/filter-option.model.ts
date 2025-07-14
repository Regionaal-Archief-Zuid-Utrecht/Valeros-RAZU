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

export interface FilterOptionModel {
  label: string;
  fields: FilterOptionFieldModel[];
  values: FilterOptionValueModel[];
  hideValueIds?: string[];
  showOnlyValueIds?: string[];
  showOnlyForSelectedFilters?: FilterOptionsIdsModel;
}

export interface FilterOptionFieldModel {
  id: string;
  elasticSuffix?: string;
}

export interface FilterOptionValueModel {
  ids: string[];
  label?: string;
  filterHitIds: string[];
}
