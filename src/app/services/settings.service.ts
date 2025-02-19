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

  getVisiblePredicates(): PredicateVisibilityEntries {
    // TODO: Fix type issue
    return (
      Settings.predicateVisibility as unknown as PredicateVisibilitySettings
    )[this.viewModes.current.value];
  }

  getVisiblePredicatesFlattened(visibility: PredicateVisibility): string[] {
    const visibilityEntries = this.getVisiblePredicates();
    return visibilityEntries[visibility].flatMap(
      (section) => section.predicates,
    );
  }

  getPredicateVisibility(predicateId: string): PredicateVisibility {
    if ((Settings.alwaysHidePredicates as string[]).includes(predicateId)) {
      return PredicateVisibility.Hide;
    }
    const hidePredicates = this.getVisiblePredicatesFlattened(
      PredicateVisibility.Hide,
    );
    if (hidePredicates.includes(predicateId)) {
      return PredicateVisibility.Hide;
    }

    const showPredicates = this.getVisiblePredicatesFlattened(
      PredicateVisibility.Show,
    );
    const detailPredicates = this.getVisiblePredicatesFlattened(
      PredicateVisibility.Details,
    );

    const shouldShowAllPredsNotShownInDetails = showPredicates.includes('*');
    const predIsShownInDetails = detailPredicates.includes(predicateId);
    const shouldShowPred = showPredicates.includes(predicateId);

    if (
      (shouldShowAllPredsNotShownInDetails && !predIsShownInDetails) ||
      shouldShowPred
    ) {
      return PredicateVisibility.Show;
    }

    const shouldShowRemainingPredsInDetails = detailPredicates.includes('*');
    const predIsAlreadyShown = showPredicates.includes(predicateId);
    const shouldShowDetailPred = detailPredicates.includes(predicateId);
    if (
      (shouldShowRemainingPredsInDetails && !predIsAlreadyShown) ||
      shouldShowDetailPred
    ) {
      return PredicateVisibility.Details;
    }

    return PredicateVisibility.Hide;
  }
}
