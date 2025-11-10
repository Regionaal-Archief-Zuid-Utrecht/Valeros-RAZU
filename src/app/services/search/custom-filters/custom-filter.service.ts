import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomFilterService {
  customFilterIds: BehaviorSubject<Set<string>> = new BehaviorSubject<
    Set<string>
  >(new Set());

  register(filterId: string) {
    console.log('Registering custom filter', filterId);
    this.customFilterIds.next(
      new Set([...this.customFilterIds.value, filterId]),
    );
  }
}
