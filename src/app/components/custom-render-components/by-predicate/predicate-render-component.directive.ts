import { Directive, Input } from '@angular/core';
import { HopLinkSettings } from '../../../models/settings/hop-link-settings.model';

@Directive()
export abstract class PredicateRenderComponent {
  @Input() data?: {
    value: string;
    nodeId?: string;
    hopLinkSettings?: HopLinkSettings;
  };
}
