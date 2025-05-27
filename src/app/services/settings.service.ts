import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { FilterPanelLocation } from '../models/settings/filter-panel-location.enum';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import { ViewModeSettings } from '../models/settings/view-mode-settings.type';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeService } from './view-mode.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(public viewModes: ViewModeService) {
    this._checkEndpoints();
  }

  private _checkEndpoints() {
    if (Object.keys(Settings.endpoints.data).length === 0) {
      console.warn(
        'No endpoints configured, add endpoints in the endpoint settings.',
      );
    }
  }

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
