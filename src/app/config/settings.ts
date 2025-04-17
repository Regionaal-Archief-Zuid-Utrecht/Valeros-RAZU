import { FilterModel, FilterType } from '../models/filters/filter.model';
import { HeaderSettings } from '../models/header/header-position.types';
import { PredicateVisibility } from '../models/settings/predicate-visibility-settings.model';
import { RenderMode } from '../models/settings/render-component-settings.type';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import { ViewMode } from '../models/view-mode.enum';
import { clusteringSettings } from './settings/clustering.settings';
import { endpointSettings } from './settings/endpoint.settings';
import { fileTypeSettings } from './settings/file-types.settings';
import { filteringSettings } from './settings/filtering.settings';
import { iiifSettings } from './settings/iiif.settings';
import { matomoSettings } from './settings/matomo.settings';
import { namespacePrefixes } from './settings/namespace-prefixes.settings';
import { searchSettings } from './settings/search.settings';
import { sortingSettings } from './settings/sorting.settings';

export const filePredicates: string[] = [
  'http://xmlns.com/foaf/0.1/depiction',
  // 'https://schema.org/thumbnail',
  'https://schema.org/image',
  'bestand_url',
];

export const hasImageFilters: FilterModel[] = filePredicates.map(
  (imagePred) => {
    return {
      filterId: 'image',
      fieldId: imagePred,
      type: FilterType.Field,
    };
  },
);

const typePredicates: string[] = [
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  // 'https://www.ica.org/standards/RiC/ontology#hasRecordSetType',
  'https://schema.org/additionalType',
  // 'http://www.wikidata.org/entity/P31',
  'https://data.razu.nl/def/ldto/classificatie',
];

const parentPredicates: string[] = [
  // 'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
  // 'https://schema.org/isPartOf',
  // 'https://schema.org/hadPrimarySource',
  'is_onderdeel_van',
  'https://data.razu.nl/def/ldto/isOnderdeelVan',
];

export const labelPredicates: string[] = [
  'naam',
  'http://www.w3.org/2000/01/rdf-schema#label',
  'http://www.w3.org/2004/02/skos/core#prefLabel',
  'https://schema.org/name',
  // 'https://www.ica.org/standards/RiC/ontology#title',
  // 'https://www.ica.org/standards/RiC/ontology#textualValue',
  'https://data.razu.nl/def/ldto/naam',
  'https://data.razu.nl/def/ldto/begripLabel',
  'https://data.razu.nl/def/ldto/verwijzingNaam',
  'https://data.razu.nl/def/ldto/identificatieKenmerk',
];

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

  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  showLanguageToggle: false,
  labelMaxChars: 100,
  predicates: {
    parents: parentPredicates,
    label: labelPredicates,
    type: typePredicates,
    images: filePredicates,
    files: filePredicates,
    hopImages: [
      [
        'https://data.razu.nl/def/ldto/heeftRepresentatie',
        'https://data.razu.nl/def/ldto/URLBestand',
      ],
    ],
  },
  renderComponents: {
    [RenderMode.ByType]: {
      // 'https://schema.org/Photograph': { componentId: 'sdo-photograph' },
      // 'https://hetutrechtsarchief.nl/id/aet/scnni': {
      //   componentId: 'gescand-inventarisnummer',
      // },
      // 'https://hetutrechtsarchief.nl/id/aet/rub': {
      //   componentId: 'hua-rubriek',
      // },
    },
    [RenderMode.ByPredicate]: {
      'http://xmlns.com/foaf/0.1/depiction': {
        componentId: 'node-images',
      },
      'https://schema.org/thumbnail': {
        componentId: 'node-images',
      },
      // 'https://schema.org/contentLocation': {
      //   componentId: 'map-thumb',
      // },
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
        componentId: 'node-type',
      },
      'https://www.ica.org/standards/RiC/ontology#hasRecordSetType': {
        componentId: 'node-type',
      },
      'https://schema.org/additionalType': {
        componentId: 'node-type',
      },
      'http://www.wikidata.org/entity/P31': {
        componentId: 'node-type',
      },
      'https://data.razu.nl/def/ldto/omvang': {
        componentId: 'ldto-omvang',
      },
      'https://data.razu.nl/def/ldto/heeftRepresentatie': {
        componentId: 'file-renderer',
        hopLinkSettings: {
          preds: ['https://data.razu.nl/def/ldto/URLBestand'],
          showOriginalLink: false,
        },
      },
      'https://data.razu.nl/def/ldto/event': {
        componentId: 'ldto-event',
      },
      'https://data.razu.nl/def/ldto/betrokkene': {
        componentId: 'hop-link',
        hopLinkSettings: {
          preds: ['https://data.razu.nl/def/ldto/Actor'],
        },
      },
      'https://data.razu.nl/def/ldto/gerelateerdInformatieobject': {
        componentId: 'hop-link',
        hopLinkSettings: {
          preds: [
            'https://data.razu.nl/def/ldto/gerelateerdInformatieobjectVerwijzing',
          ],
          showHops: false,
        },
      },
      'http://www.w3.org/ns/prov#hadPrimarySource': {
        componentId: 'hop-image',
        hopLinkSettings: {
          preds: ['http://xmlns.com/foaf/0.1/depiction'],
          showOriginalLink: true,
        },
      },
      'https://data.razu.nl/def/ldto/dekkingInTijd': {
        componentId: 'ldto-dekking-in-tijd',
      },
      'https://data.razu.nl/def/ldto/URLBestand': {
        componentId: 'ldto-url-bestand',
      },
      'https://www.ica.org/standards/RiC/ontology#hasOrHadIdentifier': {
        componentId: 'rico-identifier',
      },
      'https://schema.org/identifier': {
        componentId: 'rico-identifier',
      },
    },
  },
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
  sectionNextToTableWidth: { search: '30%', details: '40%' },
  imageForWhenLoadingFails: '/assets/img/image-load-fail.png',
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
  pdfConversionUrl: 'https://ontwikkel.viewer.razu.nl/gotenberg/convert?url=',
  header: {
    showLogo: true,
    showTitle: false,
    showButton: false,
    logoPath: '/assets/img/logo.svg',
    titleType: 'short' as const, // Options: 'short', 'regular'
    scale: 'small' as const, // Options: 'small', 'medium', 'large'
    gapBeforeContent: 'small' as const, // Options: 'small', 'medium', 'large'
    horizontalPosition: 'left' as const, // Options: stick-to-left, left, center, right, stick-to-right
    verticalPosition: 'top' as const, // Options: top, middle, bottom, middle only works if horizontalPosition is stick-to-left or stick-to-right
  } satisfies HeaderSettings,
};
