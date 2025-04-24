import {
  RenderComponentsSettings,
  RenderMode,
} from '../../models/settings/render-component-settings.type';

export const renderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: {}, // Use this to overrule the entire way a node is displayed, based on its type. E.g., for all nodes with type sdo:CreativeWork, render a custom component instead of using the default table view.
  [RenderMode.ByPredicate]: {
    'http://xmlns.com/foaf/0.1/depiction': {
      componentId: 'file-renderer',
    },
    'https://schema.org/thumbnail': {
      componentId: 'file-renderer',
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
};
