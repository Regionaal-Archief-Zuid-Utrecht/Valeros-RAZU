import { Injectable } from '@angular/core';
import { ViewModeService } from './view-mode.service';
import { Settings } from '../config/settings';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSettings } from '../models/settings/view-mode-settings.type';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import {
  PredicateVisibility,
  PredicateVisibilityEntries,
  PredicateVisibilitySettings,
} from '../models/settings/predicate-visibility-settings.model';
import { FilterPanelLocation } from '../models/settings/filter-panel-location.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(public viewModes: ViewModeService) {}

  showingFilterPanelOnSide(): boolean {
    return (
      Settings.filtering.filterPanelLocation == FilterPanelLocation.Left ||
      Settings.filtering.filterPanelLocation == FilterPanelLocation.Right
    );
  }

  hasViewModeSetting(viewModeSetting: ViewModeSetting): boolean {
    const currentViewMode: ViewMode = this.viewModes.current.value;
    if (currentViewMode === undefined) {
      return true;
    }
    const viewModeSettings = (Settings.viewModes as ViewModeSettings)[
      currentViewMode
    ];
    return viewModeSettings?.[viewModeSetting];
  }
}
