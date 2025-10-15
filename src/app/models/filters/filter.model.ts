export interface FilterModel {
  filterId?: string;
  fieldId?: string;
  valueId?: string;
  type: FilterType;
  // Optional bounds for range filters (e.g., date range on document_day)
  gte?: string;
  lte?: string;
}

export enum FilterType {
  Field,
  Value,
  FieldAndValue,
  Range,
}
