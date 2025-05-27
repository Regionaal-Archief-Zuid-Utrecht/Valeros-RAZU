import { FilterPanelLocation } from '../../models/settings/filter-panel-location.enum';
import { FilteringSettings } from '../../models/settings/filtering-settings.model';

export const filteringSettings: FilteringSettings = {
  showFilterPanel: true,
  showOrganizationsFilter: false,
  filterPanelLocation: FilterPanelLocation.Left,
  minNumOfValuesForFilterOptionToAppear: 1,
  filterOptions: {},
};
