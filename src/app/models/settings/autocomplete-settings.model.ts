import { FilterType } from '../filters/filter.model';

export interface AutocompleteSettings {
  enabled: boolean;
  maxAutocompleteOptionsPerEndpoint: number;
  maxAutocompleteOptionsToShow: number;
  filtersForAutocompleteOptions: Record<
    string,
    {
      type: FilterType;
      fieldIds: string[];
      valueIds: string[];
    }
  >;
}
