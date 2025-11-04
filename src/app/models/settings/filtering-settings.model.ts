import { FilterOptionModel } from '../filters/filter-option.model';

export interface FilteringSettings {
  showFilterPanel: boolean;
  showOrganizationsFilter: boolean;
  minNumOfValuesForFilterOptionToAppear: number;
  filterOptions: Record<string, FilterOptionModel>;
}
