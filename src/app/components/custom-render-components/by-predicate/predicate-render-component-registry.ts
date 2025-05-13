import { Type } from '@angular/core';
import { HopImageComponent } from '../../features/node/node-render-components/predicate-render-components/hop-components/hop-image/hop-image.component';
import { HopLinkComponent } from '../../features/node/node-render-components/predicate-render-components/hop-components/hop-link/hop-link.component';
import { LdtoDekkingInTijdComponent } from './ldto-dekking-in-tijd/ldto-dekking-in-tijd.component';
import { LdtoEventComponent } from './ldto-event/ldto-event.component';
import { LdtoOmvangComponent } from './ldto-omvang/ldto-omvang.component';
import { LdtoUrlBestandComponent } from './ldto-url-bestand/ldto-url-bestand.component';
import { RicoIdentifierComponent } from './rico-identifier/rico-identifier.component';

// TODO: Replace this, and simply refer directly to the component in the render component settings
export const PREDICATE_RENDER_COMPONENT_REGISTRY: Record<string, Type<any>> = {
  'ldto-dekking-in-tijd': LdtoDekkingInTijdComponent,
  'ldto-event': LdtoEventComponent,
  'ldto-omvang': LdtoOmvangComponent,
  'ldto-url-bestand': LdtoUrlBestandComponent,
  'rico-identifier': RicoIdentifierComponent,
  'hop-link': HopLinkComponent,
  'hop-image': HopImageComponent,
};
