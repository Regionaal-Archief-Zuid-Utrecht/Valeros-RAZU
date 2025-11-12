import { FileRendererComponent } from '../../../components/features/node/node-render-components/predicate-render-components/file-renderer/file-renderer.component';
import {
  RenderComponentsSettings,
  RenderMode,
} from '../../../models/settings/render-component-settings.type';
import { renderComponentSettings } from '../../default-settings/settings/render-component.settings';

export const triplyRenderComponentSettings: RenderComponentsSettings = {
  [RenderMode.ByType]: [...renderComponentSettings[RenderMode.ByType]],
  [RenderMode.ByPredicate]: [
    ...renderComponentSettings[RenderMode.ByPredicate],
    {
      component: FileRendererComponent,
      predicates: [
        'http://xmlns.com/foaf/0.1/depiction',
        'http://schema.org/audio',
        'https://triplydb.com/academy/pokemon/vocab/cry',
      ],
      requiresExplicitRendering: true,
    },
  ],
};
