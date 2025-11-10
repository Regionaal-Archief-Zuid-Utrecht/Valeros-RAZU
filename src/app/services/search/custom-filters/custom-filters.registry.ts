import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomFilterService } from './custom-filter.service';

@Injectable({
  providedIn: 'root',
})
export class CustomFiltersRegistry {
  private _all = new BehaviorSubject<Map<string, CustomFilterService>>(
    new Map(),
  );

  getAll() {
    return this._all.value;
  }

  register(filterId: string, service: CustomFilterService) {
    console.log('Registering custom filter service', filterId, service);
    const currentFilters = new Map(this._all.value);
    currentFilters.set(filterId, service);
    this._all.next(currentFilters);
  }

  unregister(filterId: string) {
    console.log('Unregistering custom filter service', filterId);
    const currentFilters = new Map(this._all.value);
    currentFilters.delete(filterId);
    this._all.next(currentFilters);
  }

  getService(filterId: string): CustomFilterService | undefined {
    return this._all.value.get(filterId);
  }

  hasService(filterId: string): boolean {
    return this._all.value.has(filterId);
  }
}
