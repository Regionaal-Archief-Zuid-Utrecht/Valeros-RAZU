import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewMode } from '../models/view-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService {
  current: BehaviorSubject<ViewMode> = new BehaviorSubject<ViewMode>(
    ViewMode.List,
  );

  constructor() {}
}
