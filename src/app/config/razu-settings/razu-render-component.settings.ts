import { LdtoDekkingInTijdComponent } from '../../components/custom-render-components/by-predicate/ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { LdtoEventComponent } from '../../components/custom-render-components/by-predicate/ldto-event/ldto-event.component';
import { LdtoOmvangComponent } from '../../components/custom-render-components/by-predicate/ldto-omvang/ldto-omvang.component';
import { LdtoUrlBestandComponent } from '../../components/custom-render-components/by-predicate/ldto-url-bestand/ldto-url-bestand.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { HopLinkComponent } from '../../components/features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import {
  RenderComponentsSettings,
  RenderMode,
} from '../../models/settings/render-component-settings.type';
import { renderComponentSettings } from '../default-settings/render-component.settings';

export const razuRenderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [],
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
