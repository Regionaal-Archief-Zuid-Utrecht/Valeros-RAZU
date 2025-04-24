import { FilterModel, FilterType } from '../models/filters/filter.model';
import { PredicateVisibility } from '../models/settings/predicate-visibility-settings.model';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import { ViewMode } from '../models/view-mode.enum';
import { clusteringSettings } from './settings/clustering.settings';
import { endpointSettings } from './settings/endpoint.settings';
import { fileTypeSettings } from './settings/file-types.settings';
import { filteringSettings } from './settings/filtering.settings';
import { iiifSettings } from './settings/iiif.settings';
import { matomoSettings } from './settings/matomo.settings';
import { namespacePrefixes } from './settings/namespace-prefixes.settings';
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
  sorting: sortingSettings,
  filtering: filteringSettings,
  clustering: clusteringSettings,
  search: searchSettings,
  iiif: iiifSettings,
  namespacePrefixes: namespacePrefixes,
  matomo: matomoSettings,
  fileTypes: fileTypeSettings,
  ui: uiSettings,
  predicates: predicateSettings,
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  renderComponents: renderComponentSettings,
  viewModes: {
    [ViewMode.List]: {
      [ViewModeSetting.ShowDetails]: true,
      [ViewModeSetting.ShowParents]: false,
      [ViewModeSetting.ShowTypes]: true,
      [ViewModeSetting.ShowTitle]: true,
      [ViewModeSetting.ShowOrganization]: false,
      [ViewModeSetting.ShowFileNextToTable]: true,
      [ViewModeSetting.EnrichWithIncomingRelations]: false, // NOTE: Detail view always enriches with incoming relations, regardless of this setting
    },
    [ViewMode.Grid]: {
      [ViewModeSetting.ShowTitle]: true,
      [ViewModeSetting.ShowDetails]: true,
      [ViewModeSetting.ShowTypes]: true,
      [ViewModeSetting.ShowOrganization]: false,
      [ViewModeSetting.ShowFileNextToTable]: true,
      [ViewModeSetting.EnrichWithIncomingRelations]: false,
    },
  },
  predicateVisibility: {
    [ViewMode.List]: {
      [PredicateVisibility.Show]: [
        {
          predicates: [
            'aggregatieniveau',
            'archief',
            'classificatie',
            'archiefvormer',
          ],
        },
      ],
      [PredicateVisibility.Details]: [
        {
          predicates: [
            ...filePredicates,
            'https://data.razu.nl/def/ldto/heeftRepresentatie',
            'https://data.razu.nl/def/ldto/dekkingInRuimte',
            'https://data.razu.nl/def/ldto/dekkingInTijd',
            'https://data.razu.nl/def/ldto/naam',
            'https://schema.org/author',
            'https://data.razu.nl/def/ldto/omschrijving',
            'https://data.razu.nl/def/ldto/URLBestand',
            'https://www.ica.org/standards/RiC/ontology#expressedDateValue',
            'https://www.ica.org/standards/RiC/ontology#hasCreator',
            '*',
          ],
        },
      ],
      [PredicateVisibility.Hide]: [
        {
          predicates: [
            ...typePredicates,
            ...parentPredicates,
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa7',
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_42e406dd',
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_f90465b3',
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa10',
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_3d782f30',
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_de27ae7a',
            'https://identifier.overheid.nl/tooi/def/thes/kern/c_dfa0ff1f',
          ],
        },
      ],
    },
    [ViewMode.Grid]: {
      [PredicateVisibility.Show]: [],
      [PredicateVisibility.Details]: [{ predicates: ['*'] }],
      [PredicateVisibility.Hide]: [],
    },
  },
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
