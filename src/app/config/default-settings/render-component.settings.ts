import { LdtoDekkingInTijdComponent } from '../../components/custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { LdtoEventComponent } from '../../components/custom-render-components/by-predicate/ldto-event/ldto-event.component';
import { LdtoOmvangComponent } from '../../components/custom-render-components/by-predicate/ldto-omvang/ldto-omvang.component';
import { LdtoUrlBestandComponent } from '../../components/custom-render-components/by-predicate/ldto-url-bestand/ldto-url-bestand.component';
import { RicoIdentifierComponent } from '../../components/custom-render-components/by-predicate/rico-identifier/rico-identifier.component';
import { SampleTypeRenderComponentComponent } from '../../components/custom-render-components/by-type/sample-type-render-component/sample-type-render-component.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { HopImageComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-image/hop-image.component';
import { HopLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { NodeTypeComponent } from '../../components/features/node/node-types/node-type/node-type.component';
import {
  RenderComponentsSettings,
  RenderMode,
} from '../../models/settings/render-component-settings.type';

export const renderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [
    // Use this to overrule the entire way a node is displayed, based on its type. E.g., for all nodes with type sdo:CreativeWork, render a custom component instead of using the default table view.
    {
      component: SampleTypeRenderComponentComponent,
      predicates: [],
    },
  ],
  [RenderMode.ByPredicate]: [
    // Use this to overrule the way a node value is displayed, based on the predicate. E.g., render a file renderer for all values of the predicate http://xmlns.com/foaf/0.1/depiction, instead of using the default node link.
    {
      component: LdtoOmvangComponent,
      predicates: ['https://data.razu.nl/def/ldto/omvang'],
    },
    {
      component: LdtoEventComponent,
      predicates: ['https://data.razu.nl/def/ldto/event'],
    },
    {
      component: HopLinkComponent,
      predicates: ['https://data.razu.nl/def/ldto/betrokkene'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/Actor'],
        showHops: false,
      },
    },
    {
      component: HopLinkComponent,
      predicates: ['https://data.razu.nl/def/ldto/beperkingGebruik'],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/beperkingGebruikType'],
        showHops: false,
      },
    },
    {
      component: HopLinkComponent,
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
      predicates: ['http://www.w3.org/ns/prov#hadPrimarySource'],
      hopLinkSettings: {
        preds: ['http://xmlns.com/foaf/0.1/depiction'],
        showOriginalLink: true,
      },
    },
    {
      component: LdtoDekkingInTijdComponent,
      predicates: ['https://data.razu.nl/def/ldto/dekkingInTijd'],
    },
    {
      component: LdtoUrlBestandComponent,
      predicates: ['https://data.razu.nl/def/ldto/URLBestand'],
    },
    {
      component: RicoIdentifierComponent,
      predicates: [
        'https://www.ica.org/standards/RiC/ontology#hasOrHadIdentifier',
        'https://schema.org/identifier',
      ],
    },
    {
      component: NodeTypeComponent,
      predicates: [
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
        'https://www.ica.org/standards/RiC/ontology#hasRecordSetType',
        'https://schema.org/additionalType',
        'http://www.wikidata.org/entity/P31',
      ],
      requiresExplicitRendering: true, // The node type component is a built-in component used elsewhere throughout the code-base, so it is not exclusively used as a predicate render component. Because of this, it has its own pre-defined input props, which is why we use those instead of the default data structure (PredicateRenderComponentInput). To do this, however, we need to manually and explicitly configure how to render this component in node-table-cell.
    },
    {
      component: FileRendererComponent,
      predicates: [
        'https://data.razu.nl/def/ldto/heeftRepresentatie',
        'https://data.razu.nl/def/ldto/isRepresentatieVan',
      ],
      hopLinkSettings: {
        preds: ['https://data.razu.nl/def/ldto/URLBestand'],
        showOriginalLink: false,
      },
      requiresExplicitRendering: true,
    },
    // {
    //   component: FileRendererComponent,
    //   predicates: [
    //     'http://xmlns.com/foaf/0.1/depiction',
    //     'https://schema.org/thumbnail',
    //   ],
    //   requiresExplicitRendering: true,
    // },
  ],
};
