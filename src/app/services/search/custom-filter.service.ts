import { Injectable, Injector } from '@angular/core';
import {
  FIELD_IDS_TOKEN,
  FILTER_ID_TOKEN,
} from '../../components/features/filters/custom-filters/custom-filter.directive';

@Injectable({
  providedIn: 'root',
})
export class CustomFilterService {
  private injectorCache = new Map<string, Injector>();

  constructor(private injector: Injector) {}

  getOrCreateInjector(filterId: string, fieldIds: string[]): Injector {
    if (this.injectorCache.has(filterId)) {
      return this.injectorCache.get(filterId)!;
    }

    const newInjector = Injector.create({
      providers: [
        { provide: FILTER_ID_TOKEN, useValue: filterId },
        { provide: FIELD_IDS_TOKEN, useValue: fieldIds },
      ],
      parent: this.injector,
    });

    this.injectorCache.set(filterId, newInjector);
    return newInjector;
  }

  clearInjectorCache(): void {
    this.injectorCache.clear();
  }

  getCacheSize(): number {
    return this.injectorCache.size;
  }
}
