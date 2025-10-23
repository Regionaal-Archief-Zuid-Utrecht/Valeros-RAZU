import { FilteringSettings } from '../../../models/settings/filtering-settings.model';

export const filteringSettings: FilteringSettings = {
  showFilterPanel: true,
  showOrganizationsFilter: false,
  minNumOfValuesForFilterOptionToAppear: 1,
  filterOptions: {},
};

// Example:
// filterOptions: {
//   license: {
//     label: 'Licentie',
//     fieldIds: ['https://schema.org/license'],
//     values: [],
//   },
// },
