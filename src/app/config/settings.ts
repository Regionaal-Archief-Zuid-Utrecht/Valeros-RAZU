import { FilterModel, FilterType } from '../models/filters/filter.model';
import { clusteringSettings } from './settings/clustering.settings';
import { endpointSettings } from './settings/endpoint.settings';
import { fileTypeSettings } from './settings/file-types.settings';
import { filteringSettings } from './settings/filtering.settings';
import { iiifSettings } from './settings/iiif.settings';
import { matomoSettings } from './settings/matomo.settings';
import { namespacePrefixes } from './settings/namespace-prefixes.settings';
import { predicateVisibilitySettings } from './settings/predicate-visibility.settings';
import {
  filePredicates,
  parentPredicates,
  predicateSettings,
  typePredicates,
} from './settings/predicate.settings';
import { renderComponentSettings } from './settings/render-component.settings';
import { searchSettings } from './settings/search.settings';
import { sortingSettings } from './settings/sorting.settings';
import { uiSettings } from './settings/ui.settings';
import { viewModeSettings } from './settings/view-mode.settings';

export const hasImageFilters: FilterModel[] = filePredicates.map(
  (imagePred) => {
    return {
      filterId: 'image',
      fieldId: imagePred,
      type: FilterType.Field,
    };
  },
);

export const Settings = {
  endpoints: endpointSettings,
  predicateVisibility: predicateVisibilitySettings,
  sorting: sortingSettings,
  filtering: filteringSettings,
  clustering: clusteringSettings,
  renderComponents: renderComponentSettings,
  viewModes: viewModeSettings, // E.g. How are things displayed in list view, grid view, etc.
  ui: uiSettings,
  search: searchSettings,
  iiif: iiifSettings,
  namespacePrefixes: namespacePrefixes,
  fileTypes: fileTypeSettings,
  predicates: predicateSettings, // E.g. what predicates are used for parents, labels, types, files, etc.
  matomo: matomoSettings,
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  alwaysHidePredicates: [
    '@id',
    'endpointId',
    'https://data.razu.nl/def/ldto/checksum',
    'https://data.razu.nl/def/ldto/waardering',
    'https://schema.org/breadcrumb',
    // 'https://hetutrechtsarchief.nl/def/isDescendentOf',
    // 'https://hetutrechtsarchief.nl/def/isDescendantOf',
    'http://purl.org/dc/terms/hasFormat',
  ],
  onlyShowNodes: {
    // TODO: There might be a bug here
    // onlyShowInformatieObject: {
    //   fieldIds: [...typePredicates],
    //   valueIds: ['https://data.razu.nl/def/ldto/Informatieobject'],
    //   type: FilterType.FieldAndValue,
    // },
  },
  hideTypePredicates: [
    'https://data.razu.nl/def/ldto/BeperkingGebruikGegevens',
    'https://data.razu.nl/def/ldto/DekkingInTijdGegevens',
    'https://data.razu.nl/def/ldto/IdentificatieGegevens',
    'https://data.razu.nl/def/ldto/Informatieobject',
    'https://data.razu.nl/def/ldto/EventGegevens',
  ],
  alwaysHideNodes: {
    hideSkosConcept: {
      fieldIds: [...typePredicates],
      valueIds: ['http://www.w3.org/2004/02/skos/core#concept'],
      type: FilterType.FieldAndValue,
    },
    hideTerms: {
      fieldIds: [...parentPredicates],
      valueIds: [
        // 'https://hetutrechtsarchief.nl/id/trefwoorden',
        'https://termennetwerk.netwerkdigitaalerfgoed.nl',
      ],
      type: FilterType.FieldAndValue,
    },
  },
  razu: {
    sura: {
      url: 'https://ontwikkel.viewer.razu.nl/sura/process-url',
      matchUrlsSubstring: 'opslag.razu.nl',
    },
  },
};
