import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../config/settings';
import {
  SortOptionModel,
  SortOptionsModel,
} from '../models/settings/sort-option.model';

@Injectable({
  providedIn: 'root',
})
export class SortService {
  current: BehaviorSubject<SortOptionModel | undefined> = new BehaviorSubject<
    SortOptionModel | undefined
  >(undefined);

  constructor() {
    this.select(Settings.sorting.default);
  }

  select(id: string) {
    const option = this.getById(id);
    if (option) {
      this.current.next(option);
    }
  }

  getById(id: string): SortOptionModel | undefined {
    return { id: id, ...(Settings.sorting.options as SortOptionsModel)?.[id] };
  }
}
