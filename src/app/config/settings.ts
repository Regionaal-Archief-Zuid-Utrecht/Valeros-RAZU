import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import { PredicateVisibility } from '../models/settings/predicate-visibility-settings.model';
import { RenderMode } from '../models/settings/render-component-settings.type';
import { SortOrder } from '../models/settings/sort-order.enum';
import { FilterPanelLocation } from '../models/settings/filter-panel-location.enum';
import { FilterModel, FilterType } from '../models/filter.model';
import { HeaderSettings } from '../models/header/header-position.types';
import { FileType } from '../models/file-type.model';
import { FileTypeConfig } from '../models/settings/file-type-config.model';

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

const hideFilterOptionValueIds = [
  'https://data.razu.nl/def/ldto/ChecksumGegevens',
  // 'http://www.w3.org/ns/shacl#NodeShape',
  // 'http://www.w3.org/2002/07/owl#Ontology',
  'https://data.razu.nl/def/ldto/begripBegrippenlijst',
  'https://data.razu.nl/def/ldto/verwijzingIdentificatie',
  'https://data.razu.nl/def/ldto/GerelateerdInformatieobjectGegevens',
  'https://data.razu.nl/def/ldto/Object',
  'https://data.razu.nl/def/ldto/DekkingInTijdGegevens',
  'https://data.razu.nl/def/ldto/VerwijzingGegevens',
  'https://data.razu.nl/def/ldto/BegripGegevens',
  'https://data.razu.nl/def/ldto/IdentificatieGegevens',
  // 'https://creativecommons.org/ns#License',
  // 'https://schema.org/Collection',
  // 'https://schema.org/Comment',
  // 'https://schema.org/PropertyValue',
  // 'https://schema.org/Text',
  // 'https://w3id.org/pnv#PersonName',
  // 'https://www.ica.org/standards/RiC/ontology#Agent',
  // 'https://www.ica.org/standards/RiC/ontology#Date',
  // 'https://www.ica.org/standards/RiC/ontology#Event',
  // 'https://www.ica.org/standards/RiC/ontology#Extent',
  // 'https://www.ica.org/standards/RiC/ontology#Identifier',
  // 'https://www.ica.org/standards/RiC/ontology#Instantiation',
  // 'https://www.ica.org/standards/RiC/ontology#RecordSet',
  // 'https://www.ica.org/standards/RiC/ontology#Title',
  // 'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#File',
  // 'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#Fonds',
  // 'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#Series',
  // 'http://dbpedia.org/ontology/Place',
  'https://data.razu.nl/def/ldto/BetrokkeneGegevens',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa7',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_42e406dd',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_f90465b3',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_7f9dffa10',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_3d782f30',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_de27ae7a',
  'https://identifier.overheid.nl/tooi/def/thes/kern/c_dfa0ff1f',
];

const peopleValueIds = [
  // 'https://schema.org/Person',
  // 'https://data.cbg.nl/pico#PersonObservation',
  // 'http://xmlns.com/foaf/0.1/Agent',
  'https://data.razu.nl/def/ldto/archiefvormer',
];

const publicationValueIds = [
  // 'https://schema.org/Article',
  'https://schema.org/Book',
  // 'https://schema.org/BookSeries',
  // 'https://schema.org/CollectionPage',
  // 'https://schema.org/Manuscript',
  // 'https://schema.org/Newspaper',
  // 'https://schema.org/PublicationEvent',
];

const archivesValueIds = [
  // 'https://data.cbg.nl/pico-terms#doopinschrijving',
  // 'https://data.cbg.nl/pico-terms#dtb_begraven',
  // 'https://data.cbg.nl/pico-terms#geboorteakte',
  // 'https://data.cbg.nl/pico-terms#huwelijksakte',
  // 'https://data.cbg.nl/pico-terms#naamsverbetering',
  // 'https://data.cbg.nl/pico-terms#notariele-akte',
  // 'https://data.cbg.nl/pico-terms#overlijdensakte',
  // 'https://data.cbg.nl/pico-terms#trouwinschrijving',
  // 'https://schema.org/ArchiveComponent',
  // 'https://schema.org/SheetMusic',
  // 'https://www.ica.org/standards/RiC/ontology#Record',
  'https://data.razu.nl/def/ldto/Bestand',
  'https://data.razu.nl/def/ldto/Informatieobject',
];

const visualMaterialValueIds = [
  // 'https://schema.org/CreativeWork',
  // 'https://schema.org/Drawing',
  // 'https://schema.org/ImageObject',
  // 'https://schema.org/Map',
  'https://schema.org/Photograph',
  // 'https://schema.org/VideoObject',
];

export const Settings = {
  endpoints: {
    razu: {
      label: 'Regionaal Archief Zuid-Utrecht',
      endpointUrls: [
        {
          elastic: 'https://ontwikkel.search.razu.nl/ldto-objects/_search',
          sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
        },
        // // This is how an enriched endpoint would look like
        // {
        //   elastic: 'http://localhost:8000/sura/_search',
        //   sparql: 'https://api.data.razu.nl/datasets/id/object/sparql',
        // },
      ],
    },
  },
  maxNumParallelRequests: 4, // 4 SPARQL workers max for Triply
  sorting: {
    default: 'relevance',
    options: {
      relevance: {
        fields: [],
        label: 'Relevantie',
        order: SortOrder.Ascending,
        boost: {
          images: {
            boost: 100,
            filter: {
              fieldIds: filePredicates,
              valueIds: [],
              type: FilterType.Field,
            },
          },
          publications: {
            boost: 5,
            filter: {
              fieldIds: typePredicates,
              valueIds: publicationValueIds,
              type: FilterType.FieldAndValue,
            },
          },
          archives: {
            boost: 2,
            filter: {
              fieldIds: typePredicates,
              valueIds: archivesValueIds,
              type: FilterType.FieldAndValue,
            },
          },
        },
      },
      'title-a-z': {
        fields: labelPredicates,
        label: 'Titel (A-Z)',
        order: SortOrder.Ascending,
      },
      'title-z-a': {
        fields: labelPredicates,
        label: 'Titel (Z-A)',
        order: SortOrder.Descending,
      },
    },
  },
  filtering: {
    showFilterPanel: true,
    showImageFilter: false,
    showOrganizationsFilter: false,
    filterPanelLocation: FilterPanelLocation.Left,
    minNumOfValuesForFilterOptionToAppear: 1,
    filterOptions: {
      archiefVormer: {
        label: 'Archiefvormer',
        fieldIds: ['archiefvormer'],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      archief: {
        label: 'Archief',
        fieldIds: ['archief'],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      aggregatieniveau: {
        label: 'Aggregatieniveau',
        fieldIds: ['aggregatieniveau'],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      classificatie: {
        label: 'Classificatie',
        fieldIds: ['classificatie'],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      licenties: {
        label: 'Licenties',
        fieldIds: ['licenties'],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      wettelijke_beperkingen_openbaarheid: {
        label: 'Wettelijke beperkingen openbaarheid',
        fieldIds: ['wettelijke_beperkingen_openbaarheid'],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },

      // type: {
      //   label: 'Soort',
      //   fieldIds: ['classificatie'],
      //   values: [],
      //   hideValueIds: [...hideFilterOptionValueIds],
      // },
      // licentie: {
      //   label: 'Licentie',
      //   fieldIds: ['_licentie'],
      //   values: [],
      //   hideValueIds: [],
      // },
      // openbaarheid: {
      //   label: 'Openbaarheidsstatus',
      //   fieldIds: ['_openbaarheid'],
      //   values: [],
      //   hideValueIds: [],
      // },
    },
  },
  clustering: {
    filterOptionValues: {
      images: {
        label: 'Beeldmateriaal',
        valueIds: visualMaterialValueIds,
      },
      // archive: {
      //   label: 'Archieven',
      //   valueIds: archivesValueIds,
      // },
      locations: {
        label: 'Locaties',
        valueIds: [
          // 'https://hetutrechtsarchief.nl/id/aet/bd',
          'https://schema.org/Place',
          'https://schema.org/PostalAddress',
          'https://www.ica.org/standards/RiC/ontology#Place',
          'https://data.razu.nl/def/ldto/dekkingInRuimte',
          'http://www.opengis.net/ont/geosparql#Geometry',
        ],
      },
      publicDomain: {
        label: 'Publiek Domein',
        valueIds: [
          // 'https://hetutrechtsarchief.nl/id/630EAF2CCA826B2DE0534701000AE1E2',
          // 'https://hetutrechtsarchief.nl/id/609C5BCA906D4642E0534701000A17FD',
          // 'https://hetutrechtsarchief.nl/id/630EAF2CCA806B2DE0534701000AE1E2',
        ],
      },
      subject: {
        label: 'Onderwerpen',
        valueIds: [
          'http://www.w3.org/2004/02/skos/core#Concept',
          // 'https://hetutrechtsarchief.nl/def/trefwoord_tst_107',
          // 'https://hetutrechtsarchief.nl/id/aet/incat',
        ],
      },
      people: {
        label: 'Personen',
        valueIds: peopleValueIds,
      },
      publication: {
        label: 'Publicaties',
        valueIds: publicationValueIds,
      },
    },
    types: {
      recordSet: {
        label: 'RecordSet',
        valueIds: [
          'https://www.ica.org/standards/RiC/ontology#RecordSet',
          'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#File',
        ],
      },
    },
    archive: {},
  },
  search: {
    resultsPerPagePerEndpoint: 10,
    maxResultsForCounting: 500,
    autocomplete: {
      enabled: true,
      maxAutocompleteOptionsPerEndpoint: 50,
      maxAutocompleteOptionsToShow: 20,
      filtersForSearchTermOptions: {
        type: {
          type: FilterType.FieldAndValue,
          fieldIds: typePredicates,
          valueIds: [
            'http://www.w3.org/2004/02/skos/core#Concept',
            // 'https://hetutrechtsarchief.nl/def/trefwoord_tst_107',
            // 'https://hetutrechtsarchief.nl/id/aet/incat',
          ],
        },
        parents: {
          type: FilterType.FieldAndValue,
          fieldIds: [
            ...parentPredicates,
            // 'https://hetutrechtsarchief.nl/def/isDescendentOf',
          ],
          valueIds: [
            // 'https://hetutrechtsarchief.nl/id/trefwoord',
            'https://termennetwerk.netwerkdigitaalerfgoed.nl',
          ],
        },
      },
    },
  },
  viewer: {
    showReferenceStrip: true,
    preferredFormats: [
      'https://data.razu.nl/id/bestandsformaat/9e03fffdb1f119a3a36a76d19c610218', // JPG
      'https://data.razu.nl/id/bestandsformaat/52410efcd26ac40a20810e62984b87a1', // TIF
    ], // Preferred formats for IIIF, only one is chosen, processed in order
  },
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
  namespacePrefixes: {
    'https://www.ica.org/standards/RiC/ontology#': 'rico:',
    // 'https://hetutrechtsarchief.nl/def/': 'def:',
    'https://schema.org/': 'sdo:',
    'http://www.w3.org/2004/02/skos/core#': 'skos:',
    // 'https://hetutrechtsarchief.nl/id/': 'id:',
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf:',
    'http://www.w3.org/2000/01/rdf-schema#': 'rdfs:',
    'http://www.wikidata.org/entity/': 'wd:',
    'http://www.wikidata.org/prop/direct/': 'wdt:',
    'http://www.w3.org/ns/prov#': 'prov:',
    'https://data.cbg.nl/pico#': 'pico:',
    'https://w3id.org/pnv#': 'pnv:',
    'http://xmlns.com/foaf/0.1/': 'foaf:',
    'https://data.razu.nl/def/ldto/': 'ldto:',
    'https://data.razu.nl/Kasteel-Amerongen/': 'ska:',
    'https://data.razu.nl/razu/': 'razu:',
    'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#':
      'ric-rst:',
    'https://data.cbg.nl/pico-terms#': 'picot:',
    'http://www.nationaalarchief.nl/mdto-shacl#': 'mdto-sh:',
    'http://www.w3.org/ns/shacl#': 'sh:',
  },
  imageUrlSubstrings: ['proxy.archieven.nl/thumb'], // If a URL matches one of these substrings, it is considered to be an image, even if the URL does not end with an image file extension
  matomo: {
    siteId: '2',
    trackerUrl: '//analytics.boasmedia.nl/',
  },
  razu: {
    sura: {
      url: 'https://ontwikkel.viewer.razu.nl/sura/process-url',
      matchUrlsSubstring: 'opslag.razu.nl',
    },
  },
  pdfConversionUrl: 'https://ontwikkel.viewer.razu.nl/gotenberg/convert?url=',
  fileTypes: {
    [FileType.IMAGE]: {
      extensions: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'svg',
        'tiff',
        'tif',
        'webp',
      ],
      iconUrl: '/assets/img/file-types/image.png',
    },
    [FileType.PDF]: {
      extensions: ['pdf'],
      iconUrl: '/assets/img/file-types/pdf.png',
    },
    [FileType.DOC]: {
      extensions: [
        'doc',
        'docx',
        'docm',
        'dot',
        'dotx',
        'dotm',
        'odt',
        'rtf',
        'txt',
      ],
      iconUrl: '/assets/img/file-types/doc.png',
    },
    [FileType.XLS]: {
      extensions: [
        'xls',
        'xlsx',
        'xlsm',
        'xlsb',
        'xlt',
        'xltx',
        'xltm',
        'ods',
        'csv',
      ],
      iconUrl: '/assets/img/file-types/xls.png',
    },
    [FileType.PPT]: {
      extensions: ['ppt', 'pptx', 'pptm', 'pot', 'potx', 'potm', 'odp'],
      iconUrl: '/assets/img/file-types/ppt.png',
    },
    [FileType.OTHER_VIEWABLE_FILE]: {
      extensions: [
        '123',
        '602',
        'abw',
        'bib',
        'cdr',
        'cgm',
        'cmx',
        'cwk',
        'dbf',
        'dif',
        'dxf',
        'emf',
        'eps',
        'epub',
        'fodg',
        'fodp',
        'fods',
        'fodt',
        'fopd',
        'htm',
        'html',
        'hwp',
        'key',
        'ltx',
        'lwp',
        'mcw',
        'met',
        'mml',
        'mw',
        'numbers',
        'odd',
        'odg',
        'odm',
        'otg',
        'oth',
        'otp',
        'ots',
        'ott',
        'pages',
        'pbm',
        'pcd',
        'pct',
        'pcx',
        'pdb',
        'pgm',
        'ppm',
        'psd',
        'psw',
        'pub',
        'pwp',
        'pxl',
        'ras',
        'sda',
        'sdc',
        'sdd',
        'sdp',
        'sdw',
        'sgl',
        'slk',
        'smf',
        'stc',
        'std',
        'sti',
        'stw',
        'svm',
        'swf',
        'sxc',
        'sxd',
        'sxg',
        'sxi',
        'sxm',
        'sxw',
        'tga',
        'uof',
        'uop',
        'uos',
        'uot',
        'vdx',
        'vor',
        'vsd',
        'vsdm',
        'vsdx',
        'wb2',
        'wk1',
        'wks',
        'wmf',
        'wpd',
        'wpg',
        'wps',
        'xbm',
        'xhtml',
        'xlt',
        'xltm',
        'xltx',
        'xlw',
        'xml',
        'xpm',
        'zabw',
      ],
      iconUrl: '/assets/img/file-types/file.png',
    },
    [FileType.UNKNOWN]: {
      extensions: [],
      iconUrl: '/assets/img/file-types/file.png',
    },
  } as Record<FileType, FileTypeConfig>,
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
