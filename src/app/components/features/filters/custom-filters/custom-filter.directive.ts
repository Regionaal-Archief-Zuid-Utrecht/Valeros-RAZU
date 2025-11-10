import { Directive, Input } from '@angular/core';

@Directive()
export abstract class CustomFilterComponent {
  @Input() filterId?: string;
  @Input() fieldIds?: string[];
}
