import {
  Directive,
  Inject,
  InjectionToken,
  Input,
  Optional,
} from '@angular/core';

export const FILTER_ID_TOKEN = new InjectionToken<string>('filterId');
export const FIELD_IDS_TOKEN = new InjectionToken<string[]>('fieldIds');

@Directive()
export abstract class CustomFilterComponent {
  @Input() filterId?: string;
  @Input() fieldIds?: string[];

  constructor(
    @Optional() @Inject(FILTER_ID_TOKEN) injectedFilterId?: string,
    @Optional() @Inject(FIELD_IDS_TOKEN) injectedFieldIds?: string[],
  ) {
    this.filterId = injectedFilterId ?? this.filterId;
    this.fieldIds = injectedFieldIds ?? this.fieldIds;
  }
}
