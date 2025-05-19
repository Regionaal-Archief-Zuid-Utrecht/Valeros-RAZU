import { Type } from '@angular/core';
import { PredicateRenderComponent } from '../../components/custom-render-components/by-predicate/predicate-render-component.directive';
import { TypeRenderComponent } from '../../components/custom-render-components/by-type/type-render-component.component';
import { FileRendererComponent } from '../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import { MapThumbComponent } from '../../components/features/node/node-render-components/predicate-render-components/map-thumb/map-thumb.component';
import { NodeTypeComponent } from '../../components/features/node/node-types/node-type/node-type.component';
import { Direction } from '../node.model';
import { HopLinkSettings } from './hop-link-settings.model';

export type RenderComponentsSettings = {
  [v in RenderMode]: RenderComponentSettings;
};

export enum RenderMode {
  ByType,
  ByPredicate,
}

type ExplicitlyRenderedComponent =
  | FileRendererComponent
  | NodeTypeComponent
  | MapThumbComponent;

export type RenderComponent = Type<
  PredicateRenderComponent | ExplicitlyRenderedComponent | TypeRenderComponent
>;

export type RenderComponentSetting = {
  component: RenderComponent;
  componentId: string;
  predicates: string[];
  direction?: Direction;
  hopLinkSettings?: HopLinkSettings;
  requiresExplicitRendering?: boolean; // Components that require explicit rendering need to be added manually in node-table-cell
  [key: string]: any;
};

export type RenderComponentSettings = RenderComponentSetting[];
