import { Type } from '@angular/core';
import { PredicateRenderComponent } from '../../components/custom-render-components/by-predicate/predicate-render-component.directive';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
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
  component?: Type<PredicateRenderComponent | FileRendererComponent>;
  componentId: string;
  predicates: string[];
  direction?: Direction;
  hopLinkSettings?: HopLinkSettings;
  [key: string]: any;
};

export type RenderComponentSettings = RenderComponentSetting[];
