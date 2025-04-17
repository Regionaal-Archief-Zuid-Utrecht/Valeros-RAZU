import { Injectable } from '@angular/core';
import { Settings } from '../config/settings';
import { sortByArrayOrder } from '../helpers/util.helper';
import {
  PredicateSection,
  PredicateVisibility,
  PredicateVisibilityEntries,
  PredicateVisibilitySettings,
} from '../models/settings/predicate-visibility-settings.model';
import { ViewModeService } from './view-mode.service';

@Injectable({
  providedIn: 'root',
})
export class PredicateVisibilityService {
  constructor(private viewModes: ViewModeService) {}

  getVisible(): PredicateVisibilityEntries {
    return (
      Settings.predicateVisibility as unknown as PredicateVisibilitySettings
    )[this.viewModes.current.value];
  }

  getVisibleFlattened(visibility: PredicateVisibility): string[] {
    const visibilityEntries = this.getVisible();
    return visibilityEntries[visibility].flatMap(
      (section) => section.predicates,
    );
  }

  getVisibility(predicateId: string): PredicateVisibility {
    if ((Settings.alwaysHidePredicates as string[]).includes(predicateId)) {
      return PredicateVisibility.Hide;
    }
    const hidePredicates = this.getVisibleFlattened(PredicateVisibility.Hide);
    if (hidePredicates.includes(predicateId)) {
      return PredicateVisibility.Hide;
    }

    const showPredicates = this.getVisibleFlattened(PredicateVisibility.Show);
    const detailPredicates = this.getVisibleFlattened(
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

  getSections(
    nodePredicates: string[],
    visibility: PredicateVisibility,
  ): PredicateSection[] {
    const settingsSections = this.getVisible()[visibility];

    const orderedSections = settingsSections.map((section) => ({
      ...section,
      predicates: [] as string[],
    }));

    const wildcardSectionIndex = settingsSections.reduceRight(
      (lastIndex, section, index) =>
        section.predicates.includes('*') ? index : lastIndex,
      -1,
    );

    // For each predicate in node, find section it belongs to (either explicit or through wildcard)
    nodePredicates.forEach((pred) => {
      const explicitSectionIndex = settingsSections.findIndex((section) =>
        section.predicates.includes(pred),
      );

      const sectionIndex =
        explicitSectionIndex >= 0 ? explicitSectionIndex : wildcardSectionIndex;
      if (sectionIndex >= 0) {
        orderedSections[sectionIndex].predicates.push(pred);
      }
    });

    // Sort predicates within each section according to settings order
    orderedSections.forEach((section, index) => {
      const settingsPredicates = settingsSections[index].predicates;
      section.predicates = sortByArrayOrder(
        section.predicates,
        settingsPredicates,
      );
    });

    return orderedSections;
  }
}
