import {
  RenderComponentsSettings,
  RenderMode,
} from '../../models/settings/render-component-settings.type';

export const renderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [
    {
      componentId: 'sample-type-render-component',
      predicates: [],
    },
  ], // Use this to overrule the entire way a node is displayed, based on its type. E.g., for all nodes with type sdo:CreativeWork, render a custom component instead of using the default table view.
  [RenderMode.ByPredicate]: [
    {
      componentId: 'file-renderer',
      predicates: [
        'http://xmlns.com/foaf/0.1/depiction',
        'https://schema.org/thumbnail',
      ],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/URLBestand'],
        showOriginalLink: false,
      },
    },
    {
      componentId: 'file-renderer',
      predicates: ['https://data.razu.nl/def/ldto/heeftRepresentatie'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/URLBestand'],
        showOriginalLink: false,
      },
    },
    {
      componentId: 'node-type',
      predicates: [
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        'https://www.ica.org/standards/RiC/ontology#hasRecordSetType',
        'https://schema.org/additionalType',
        'http://www.wikidata.org/entity/P31',
      ],
    },
    {
      componentId: 'ldto-omvang',
      predicates: ['https://data.razu.nl/def/ldto/omvang'],
    },
    {
      componentId: 'ldto-event',
      predicates: ['https://data.razu.nl/def/ldto/event'],
    },
    {
      componentId: 'hop-link',
      predicates: ['https://data.razu.nl/def/ldto/betrokkene'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/Actor'],
        showHops: false,
      },
    },
    {
      componentId: 'hop-link',
      predicates: ['https://data.razu.nl/def/ldto/beperkingGebruik'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/beperkingGebruikType'],
        showHops: false,
      },
    },
    {
      componentId: 'hop-link',
      predicates: ['https://data.razu.nl/def/ldto/gerelateerdInformatieobject'],
      hopLinkSettings: {
        preds: [
          'https://data.razu.nl/def/ldto/gerelateerdInformatieobjectVerwijzing',
        ],
        showHops: false,
      },
    },
    {
      componentId: 'hop-image',
      predicates: ['http://www.w3.org/ns/prov#hadPrimarySource'],
      hopLinkSettings: {
        preds: ['http://xmlns.com/foaf/0.1/depiction'],
        showOriginalLink: true,
      },
    },
    {
      componentId: 'ldto-dekking-in-tijd',
      predicates: ['https://data.razu.nl/def/ldto/dekkingInTijd'],
    },
    {
      componentId: 'ldto-url-bestand',
      predicates: ['https://data.razu.nl/def/ldto/URLBestand'],
    },
    {
      componentId: 'rico-identifier',
      predicates: [
        'https://www.ica.org/standards/RiC/ontology#hasOrHadIdentifier',
        'https://schema.org/identifier',
      ],
    },
  ],
};
