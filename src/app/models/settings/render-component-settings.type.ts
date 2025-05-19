import { Type } from '@angular/core';
import { PredicateRenderComponent } from '../../components/custom-render-components/by-predicate/predicate-render-component.directive';
import { SampleTypeRenderComponentComponent } from '../../components/custom-render-components/by-type/sample-type-render-component/sample-type-render-component.component';
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

// TODO: Create generic type-based render component class (and inherit from there), remove direct reference to sample component here
export type RenderComponent = Type<
  | PredicateRenderComponent
  | FileRendererComponent
  | SampleTypeRenderComponentComponent
  | NodeTypeComponent
  | MapThumbComponent
>;

export type RenderComponentSetting = {
  component: RenderComponent;
  componentId: string;
  predicates: string[];
  direction?: Direction;
  hopLinkSettings?: HopLinkSettings;
  [key: string]: any;
};

export type RenderComponentSettings = RenderComponentSetting[];
