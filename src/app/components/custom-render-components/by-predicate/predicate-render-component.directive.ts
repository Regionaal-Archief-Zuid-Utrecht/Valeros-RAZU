import { Directive, Input } from '@angular/core';

@Directive()
export abstract class PredicateRenderComponent<T = any> {
  @Input() data?: T;
}
