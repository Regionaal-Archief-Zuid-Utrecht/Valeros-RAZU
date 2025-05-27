import { HopLinkSettings } from '../../models/settings/hop-link-settings.model';
import { RenderMode } from '../../models/settings/render-component-settings.type';

export interface RenderComponentSettings {
  componentId: string;
  hopLinkSettings?: HopLinkSettings;
  mode?: RenderMode;
}

export interface PredicateRenderSettings {
  [key: string]: RenderComponentSettings;
}

export const predicateRenderSettings: PredicateRenderSettings = {
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
    componentId: 'node-type',
  },
  'https://data.razu.nl/def/ldto/omvang': {
    componentId: 'ldto-omvang',
  },
  'https://data.razu.nl/def/ldto/heeftRepresentatie': {
    componentId: 'file-renderer',
    hopLinkSettings: {
      preds: ['https://data.razu.nl/def/ldto/URLBestand'],
      showOriginalLink: false,
    },
  },
  'https://data.razu.nl/def/ldto/event': {
    componentId: 'ldto-event',
  },
  'https://data.razu.nl/def/ldto/betrokkene': {
    componentId: 'hop-link',
    hopLinkSettings: {
      preds: ['https://data.razu.nl/def/ldto/Actor'],
    },
  },
  'https://data.razu.nl/def/ldto/gerelateerdInformatieobject': {
    componentId: 'hop-link',
    hopLinkSettings: {
      preds: [
        'https://data.razu.nl/def/ldto/gerelateerdInformatieobjectVerwijzing',
      ],
      showHops: false,
    },
  },
};
