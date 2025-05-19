import { LdtoDekkingInTijdComponent } from '../../components/custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { LdtoEventComponent } from '../../components/custom-render-components/by-predicate/ldto-event/ldto-event.component';
import { LdtoOmvangComponent } from '../../components/custom-render-components/by-predicate/ldto-omvang/ldto-omvang.component';
import { LdtoUrlBestandComponent } from '../../components/custom-render-components/by-predicate/ldto-url-bestand/ldto-url-bestand.component';
import { RicoIdentifierComponent } from '../../components/custom-render-components/by-predicate/rico-identifier/rico-identifier.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { HopImageComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-image/hop-image.component';
import { HopLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
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
      component: FileRendererComponent,
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
      component: FileRendererComponent,
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
      component: LdtoOmvangComponent,
      componentId: 'ldto-omvang',
      predicates: ['https://data.razu.nl/def/ldto/omvang'],
    },
    {
      component: LdtoEventComponent,
      componentId: 'ldto-event',
      predicates: ['https://data.razu.nl/def/ldto/event'],
    },
    {
      component: HopLinkComponent,
      componentId: 'hop-link',
      predicates: ['https://data.razu.nl/def/ldto/betrokkene'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/Actor'],
        showHops: false,
      },
    },
    {
      component: HopLinkComponent,
      componentId: 'hop-link',
      predicates: ['https://data.razu.nl/def/ldto/beperkingGebruik'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/beperkingGebruikType'],
        showHops: false,
      },
    },
    {
      component: HopLinkComponent,
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
      component: HopImageComponent,
      componentId: 'hop-image',
      predicates: ['http://www.w3.org/ns/prov#hadPrimarySource'],
      hopLinkSettings: {
        preds: ['http://xmlns.com/foaf/0.1/depiction'],
        showOriginalLink: true,
      },
    },
    {
      component: LdtoDekkingInTijdComponent,
      componentId: 'ldto-dekking-in-tijd',
      predicates: ['https://data.razu.nl/def/ldto/dekkingInTijd'],
    },
    {
      component: LdtoUrlBestandComponent,
      componentId: 'ldto-url-bestand',
      predicates: ['https://data.razu.nl/def/ldto/URLBestand'],
    },
    {
      component: RicoIdentifierComponent,
      componentId: 'rico-identifier',
      predicates: [
        'https://www.ica.org/standards/RiC/ontology#hasOrHadIdentifier',
        'https://schema.org/identifier',
      ],
    },
  ],
};
