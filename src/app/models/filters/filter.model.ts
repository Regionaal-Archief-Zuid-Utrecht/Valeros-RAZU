export interface FilterModel {
  filterId?: string;
  fieldId?: string;
  valueId?: string;
  from?: string;
  to?: string;
  type: FilterType;
}

export enum FilterType {
  Field,
  Value,
  FieldAndValue,
  DateRange,
}
