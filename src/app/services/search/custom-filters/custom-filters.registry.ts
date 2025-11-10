import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomFilterService } from './custom-filter.service';

@Injectable({
  providedIn: 'root',
})
export class CustomFiltersRegistry {
  all = new BehaviorSubject<Map<string, CustomFilterService>>(new Map());

  register(filterId: string, service: CustomFilterService) {
    console.log('Registering custom filter service', filterId, service);
    const currentFilters = new Map(this.all.value);
    currentFilters.set(filterId, service);
    this.all.next(currentFilters);
  }

  unregister(filterId: string) {
    console.log('Unregistering custom filter service', filterId);
    const currentFilters = new Map(this.all.value);
    currentFilters.delete(filterId);
    this.all.next(currentFilters);
  }

  getService(filterId: string): CustomFilterService | undefined {
    return this.all.value.get(filterId);
  }

  hasService(filterId: string): boolean {
    return this.all.value.has(filterId);
  }
}
