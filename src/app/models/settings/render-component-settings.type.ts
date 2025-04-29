import { Direction } from '../node.model';
import { HopLinkSettings } from './hop-link-settings.model';

export type RenderComponentsSettings = {
  [v in RenderMode]: RenderComponentSettings;
};

export enum RenderMode {
  ByType,
  ByPredicate,
}

export type RenderComponentSetting = {
  componentId: string;
  predicates: string[];
  direction?: Direction;
  hopLinkSettings?: HopLinkSettings;
  [key: string]: any;
};

export type RenderComponentSettings = RenderComponentSetting[];
