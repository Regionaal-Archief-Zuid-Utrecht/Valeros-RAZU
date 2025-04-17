import { FilterOptionModel } from '../filters/filter-option.model';
import { FilterPanelLocation } from './filter-panel-location.enum';

export interface FilteringSettings {
  showFilterPanel: boolean;
  showImageFilter: boolean;
  showOrganizationsFilter: boolean;
  filterPanelLocation: FilterPanelLocation;
  minNumOfValuesForFilterOptionToAppear: number;
  filterOptions: Record<string, FilterOptionModel>;
}
