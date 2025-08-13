import { LdtoDekkingInTijdComponent } from '../../../components/custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { LdtoEventComponent } from '../../../components/custom-render-components/by-predicate/ldto-event/ldto-event.component';
import { LdtoOmvangComponent } from '../../../components/custom-render-components/by-predicate/ldto-omvang/ldto-omvang.component';
import { LdtoUrlBestandComponent } from '../../../components/custom-render-components/by-predicate/ldto-url-bestand/ldto-url-bestand.component';
import { FileRendererComponent } from '../../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { HopLinkComponent } from '../../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import {
  RenderComponentsSettings,
  RenderMode,
} from '../../../models/settings/render-component-settings.type';
import { renderComponentSettings } from '../../default-settings/settings/render-component.settings';
import { RazuAfleveringComponent } from '../../../components/custom-render-components/by-type/razu-aflevering/razu-aflevering.component';
import { RenderTabWithDocViewerComponent } from '../../../components/custom-render-components/by-type/render-tab-with-doc-viewer/render-tab-with-doc-viewer.component';

export const razuRenderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [
    {
      component: RazuAfleveringComponent,
      predicates: [
        'https://data.razu.nl/id/soort/30d2cbfabc5d7cf795d3ddb00b1e8260',
      ],
    },
    {
      component: RenderTabWithDocViewerComponent,
      predicates: [
        'https://huizenenmenseninwijk.nl/def/hemiw/onderzochtPand',
      ],
    }
  ],
  [RenderMode.ByPredicate]: [
    ...renderComponentSettings[RenderMode.ByPredicate],
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
      predicates: ['https://personsincontext.org/model#PersonObservation'],
      hopLinkSettings: {
        preds: ['https://schema.org/name'],
        showHops: false,
      },
    },
    {
      component: HopLinkComponent,
      predicates: ['https://schema.org/hasParent'],
      hopLinkSettings: {
        preds: ['https://schema.org/name'],
        showHops: false,
      },
    },
    {
      component: HopLinkComponent,
      predicates: ['https://schema.org/participant'],
      hopLinkSettings: {
        preds: ['https://schema.org/name'],
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
      component: LdtoDekkingInTijdComponent,
      predicates: ['https://data.razu.nl/def/ldto/dekkingInTijd'],
    },
    {
      component: LdtoUrlBestandComponent,
      predicates: ['https://data.razu.nl/def/ldto/URLBestand'],
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
  ],
};
